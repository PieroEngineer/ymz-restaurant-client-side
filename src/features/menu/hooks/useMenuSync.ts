import { useState, useEffect } from 'react';
import type { MenuPage, DishItem, CloudMenuGetPayload, CloudMenuDiffPayload, CloudDishPayload } from '@/features/menu/types/sync.types';
import { menuApi, type PresignedUrlMapping } from '@/features/menu/api/menuApi';

export type SyncStatusType = 'Synchronized' | 'Loading' | 'Unsynchronized'; //TODO: Expand to more states like "Uploading", "downloading", etc. The change is easy in the "SyncStatusIndicator", just add the state design.

export function useMenuSync(
  currentPages: MenuPage[],
  currentDishes: DishItem[],

  // 📂 Live local files mapping reference index tracked in the UI page layer
  localPageFilesMap: Record<string, File>, 

  onInitializeData: (pages: MenuPage[], dishes: DishItem[]) => void,
  // 🆕 Add a callback parameter to notify the parent page of successful cloud commits
  onImportedImageStateNeeded: (updatedPages: MenuPage[]) => void
) {
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>('Loading');
  
  // 💾 Core Immutable Baseline Storage Snapshot
  const [dbSnapshot, setDbSnapshot] = useState<CloudMenuGetPayload>({ menuPages: [], dishes: [] });

  // 📥 Phase 1: Lifecycle Initialization Pull
  useEffect(() => {

    async function loadInitialDatabaseState() {
      try {
        setSyncStatus('Loading');
        const data = await menuApi.fetchMenuDataset();
        setDbSnapshot(data);

        // Map cloud integers back to application string representations
        const mappedPages: MenuPage[] = data.menuPages.map(p => ({
          pageId: p.pageId,
          imageUrl: p.imageUrl,
          pageNumber: p.pageNumber
        }));

        const mappedDishes: DishItem[] = data.dishes.map(d => ({
          id: d.id,
          pageId: d.menuPageId,
          imageUrl: d.imageUrl,
          coordinateXInMenu: d.coordinateXInMenu,
          coordinateYInMenu: d.coordinateYInMenu,
          name: d.name,
          cost: (d.priceCents / 100).toFixed(2),
          prepTime: d.prepTime.toString(),
          createdAt: Date.now()
        }));

        console.log('Mapped dishes', mappedDishes)
        console.log('Mapped pages', mappedPages)

        onInitializeData(mappedPages, mappedDishes);
        setSyncStatus('Synchronized');
      } catch (err) {
        console.error('🔴 Failed to load menu database baseline:', err);
        setSyncStatus('Unsynchronized');
      }
    }
    loadInitialDatabaseState();
  }, []);

  // 🔍 Phase 2: Live State Delta Status Watcher
  useEffect(() => {
    if (syncStatus === 'Loading') return;

    // Build operational comparison arrays
    const isPagesChanged = currentPages.length !== dbSnapshot.menuPages.length ||
      currentPages.some(cp => {
        const snap = dbSnapshot.menuPages.find(p => p.pageId === cp.pageId);
        if (!snap) return true;
        return snap.imageUrl !== cp.imageUrl || snap.pageNumber !== cp.pageNumber;
      });

    const isDishesChanged = currentDishes.length !== dbSnapshot.dishes.length ||
      currentDishes.some(cd => {
        const snap = dbSnapshot.dishes.find(d => d.id === cd.id);
        if (!snap) return true;
        
        const priceCents = Math.round(parseFloat(cd.cost || '0') * 100);
        const prepTime = parseInt(cd.prepTime || '0', 10);

        // console.log('Snapshot coordinates', snap.coordinateXInMenu)
        // console.log('Snapshot coordinates', cd.xPercent)
        // console.log('Their absolute substraction', Math.abs(snap.coordinateXInMenu-cd.xPercent))
        // console.log('-----------------------')

        return snap.name !== cd.name ||
          snap.priceCents !== priceCents ||
          snap.prepTime !== prepTime ||
          snap.coordinateXInMenu !== cd.coordinateXInMenu || //TODO: Verify if "1" it's a good threshold (It's better if everyone works with the same normalization "%")
          snap.coordinateYInMenu !== cd.coordinateYInMenu ||
          snap.menuPageId !== cd.pageId;  /// Is this line necessary? Maybe it's always false
      });

      console.log('isPagesChanged?', isPagesChanged)
      console.log('isDishesChanged?', isDishesChanged)

      setSyncStatus(isPagesChanged || isDishesChanged ? 'Unsynchronized' : 'Synchronized');

  }, [currentPages, currentDishes, dbSnapshot]);

  // 🚀 Phase 3: Analytical Object Diffing Engine Operation
  const synchronizeDatasetChanges = async () => {
    if (syncStatus !== 'Unsynchronized') return;
    setSyncStatus('Loading');


    // 📝 STEP 2: Build the Delta JSON Diff Document using the new S3 links
    const diffPayload: CloudMenuDiffPayload = { menuPages: [], dishes: [] };

    // 🗺️ A. Calculate Menu Pages Diff
    currentPages.forEach((cp) => {
      const original = dbSnapshot.menuPages.find(p => p.pageId === cp.pageId);
      if (!original) {
        diffPayload.menuPages.push({
          pageId: cp.pageId,
          action: 'save',
          pageNumber: cp.pageNumber,
          imageUrl: cp.imageUrl
        });
      } else {
        const updatedFields: Partial<MenuPage> = {};
        if (original.pageNumber !== cp.pageNumber) updatedFields.pageNumber = cp.pageNumber;
        if (original.imageUrl !== cp.imageUrl) updatedFields.imageUrl = cp.imageUrl;

        if (Object.keys(updatedFields).length > 0) {
          diffPayload.menuPages.push({ pageId: cp.pageId, action: 'update', updatedFields });
        }
      }
    });

    dbSnapshot.menuPages.forEach((op) => {
      if (!currentPages.some(p => p.pageId === op.pageId)) {
        diffPayload.menuPages.push({ pageId: op.pageId, action: 'delete' });
      }
    });

    // 🍔 B. Calculate Dishes Diff
    currentDishes.forEach((cd) => {
      const original = dbSnapshot.dishes.find(d => d.id === cd.id);
      const priceCents = Math.round(parseFloat(cd.cost || '0') * 100);
      const prepTime = parseInt(cd.prepTime || '0', 10);

      if (!original) {  // For a dish totally modified
        diffPayload.dishes.push({
          id: cd.id,
          action: 'save',
          name: cd.name,
          imageUrl: cd.imageUrl, 
          priceCents,
          prepTime,
          isOutOfStock: true, // Preset parameter enforcement rule
          menuPageId: cd.pageId,
          coordinateXInMenu: cd.coordinateXInMenu,
          coordinateYInMenu: cd.coordinateYInMenu,
          description: '' // Preset parameter enforcement rule
        });
      } else {  // For a dish partially modified
        const updatedFields: Partial<CloudDishPayload> = {};
        if (original.name !== cd.name) updatedFields.name = cd.name;
        if (original.priceCents !== priceCents) updatedFields.priceCents = priceCents;
        if (original.prepTime !== prepTime) updatedFields.prepTime = prepTime;
        if (original.coordinateXInMenu !== cd.coordinateXInMenu) updatedFields.coordinateXInMenu = cd.coordinateXInMenu;
        if (original.coordinateYInMenu !== cd.coordinateYInMenu) updatedFields.coordinateYInMenu = cd.coordinateYInMenu;
        if (original.menuPageId !== cd.pageId) updatedFields.menuPageId = cd.pageId;  /// Is it possible? perhaps this line is unnecessary

        if (Object.keys(updatedFields).length > 0) {
          diffPayload.dishes.push({ id: cd.id, action: 'update', updatedFields });
        }
      }
    });

    dbSnapshot.dishes.forEach((od) => {
      if (!currentDishes.some(d => d.id === od.id)) {
        diffPayload.dishes.push({ id: od.id, action: 'delete' });
      }
    });

    let syncResponseData: { presignedUrls: PresignedUrlMapping[] } | null = null;

    try {
      console.log('🔎  Sent diff', diffPayload)
      
      // 🗺️ HOP 1: Update structural schemas in DynamoDB first & retrieve upload tokens
      syncResponseData = await menuApi.pushMenuDeltaChanges(diffPayload);

      console.log('🔎  Received response with presigned URLs', syncResponseData);

      // ☁️ HOP 2: Process binary media streaming to S3 concurrently for ultra-high performance
      if (syncResponseData.presignedUrls && syncResponseData.presignedUrls.length > 0) {
        console.log('⚡ Concurrently streaming binaries directly to cloud S3 buckets...');
        
        await Promise.all(
          syncResponseData.presignedUrls.map(async (mapping) => {
            const fileToUpload = localPageFilesMap[mapping.pageId];
            if (!fileToUpload) return; // Guard: file reference missing locally

            console.log('🔎  Image ID to upload', mapping.pageId);
            console.log('🔎  Image URL for uploading', mapping.uploadUrl);

            try {
              await menuApi.uploadImageToS3(mapping.uploadUrl.replaceAll("172.18.0.2", "localhost"), fileToUpload); // TODO: Move that replacement fix to the backend, it shouldn't be here
            } catch (s3UploadError) {
              throw new Error(`S3_UPLOAD_FAILURE|${mapping.pageId}|${s3UploadError instanceof Error ? s3UploadError.message : ''}`);
            }
          })
        );

      console.log('✅🖼️  All images where successfully processed');
      }

      // 🎉 TRANSACTION ENTIRELY SUCCESSFUL: Update local snapshot memory references
      const finalSnapshotPages = currentPages.map((page) => {
        // Map the permanent public S3 URL back into our runtime state references
        const tokenMatch = syncResponseData?.presignedUrls.find(u => u.pageId === page.pageId);
        return {
          pageId: page.pageId,
          imageUrl: tokenMatch ? tokenMatch.publicUrl : page.imageUrl,
          pageNumber: page.pageNumber
        };
      });

      const nextSnapshot: CloudMenuGetPayload = {
        menuPages: finalSnapshotPages.map(p => ({ pageId: p.pageId, imageUrl: p.imageUrl, pageNumber: p.pageNumber })),
        dishes: currentDishes.map(d => ({
          id: d.id, name: d.name, imageUrl: '', priceCents: Math.round(parseFloat(d.cost || '0') * 100),                                                                        // TODO: Take care setting the dish for free
          prepTime: parseInt(d.prepTime || '0', 10), isOutOfStock: true, menuPageId: d.pageId, coordinateXInMenu: d.coordinateXInMenu, coordinateYInMenu: d.coordinateYInMenu, description: ''   //        and avoid instant preparation 
        }))
      };

      onImportedImageStateNeeded(finalSnapshotPages)

      setDbSnapshot(nextSnapshot);
      setSyncStatus('Synchronized');

      console.log('🔎  New Snapshot', dbSnapshot)
      console.log('🔎  Page data now', currentPages)
      console.log('🔎  Dishe data now', currentDishes)

    } catch (err) {
      console.error('🔴  Critical database upload synchronization failure:', err);

      // 💡 Note: We do NOT clear or touch currentPages or currentDishes. 
      // The restaurant operator's local modifications remain safely on their screen!

      const errorMessage = err instanceof Error ? err.message : '';

      // 🚨 COMPENSATING TRANSACTION: If metadata succeeded but S3 upload failed, wipe ghost entries from DynamoDB
      if (syncResponseData !== null && errorMessage.startsWith('S3_UPLOAD_FAILURE')) {
        console.warn('⚠️ Metadata saved but binary upload failed. Possible ghost items in backend...');
        // try {  // We will 
        //   // Send an inverted schema instruction or explicit rollback configuration block back to the server
        //   await menuApi.pushMenuDeltaChanges(diffPayload);
        // } catch (rollbackError) {
        //   console.error('🚨 Fatal: Server-side database compensating fallback loop rejected:', rollbackError);
        // }
      }

      /* * TODO: Move to Option 2 (Backend-Managed Transaction).
       * Client-side transaction orchestration remains fragile. Refactor the endpoint to accept a multipart 
       * form data payload containing both the JSON payload string and file binaries so that the 
       * server can orchestrate this transaction natively.
       * 
       * Event-Driven: S3 triggers an EventBridge notification or S3 Event Notification directly to a Lambda function upon successful upload (s3:ObjectCreated:*). This Lambda updates the DynamoDB status to "ACTIVE" and removes the TTL
       */

      setSyncStatus('Unsynchronized'); // Leave local mutations intact on screen for retry attempts

    }
  };

  return { syncStatus, synchronizeDatasetChanges };
}