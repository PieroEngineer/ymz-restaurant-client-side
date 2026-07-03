import { useState, useEffect } from 'react';
import type { MenuPage, DishItem, CloudMenuGetPayload} from '@/features/menu/types/sync.types';
import { menuApi, type PresignedUrlMapping } from '@/features/menu/api/menuApi';
import { checkMinimalDiff, generateDiffPayload } from '@/features/menu/helpers/menuComparators';

export type SyncStatusType = 'Synchronized' | 'Loading' | 'Unsynchronized'; //TODO: Change to 'Synchronized' | 'Downloading' | 'Uploading' | 'Unsynchronized''

export function useMenuSync(
  currentPages: MenuPage[],
  currentDishes: DishItem[],

  // 📂 Live local files mapping reference index tracked in the UI page layer
  localPageFilesMap: Record<string, File>, 

  onInitializeData: (pages: MenuPage[], dishes: DishItem[]) => void,
  // 🆕 Add a callback parameter to notify the parent page of successful cloud commits
  onImportedImageWithRemoteUrlsNeeded: (updatedPages: MenuPage[]) => void
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

      setSyncStatus(checkMinimalDiff(currentPages, currentDishes, dbSnapshot) ? 'Unsynchronized' : 'Synchronized');

  }, [currentPages, currentDishes, dbSnapshot]);



  // 🚀 Phase 3: Analytical Object Diffing Engine Operation
  const synchronizeDatasetChanges = async () => {
    if (syncStatus !== 'Unsynchronized') return;
    setSyncStatus('Loading');

    const diffPayload = generateDiffPayload(currentPages, currentDishes, dbSnapshot);

    let syncResponseData: { presignedUrls: PresignedUrlMapping[] } | null = null;

    try {
      
      // 🗺️ Update structural schemas in DynamoDB first & retrieve upload tokens
      syncResponseData = await menuApi.pushMenuDeltaChanges(diffPayload);

      // ☁️ Process binary media streaming to S3 concurrently for ultra-high performance
      if (syncResponseData.presignedUrls && syncResponseData.presignedUrls.length > 0) {
        
        await Promise.all(
          syncResponseData.presignedUrls.map(async (mapping) => {
            const fileToUpload = localPageFilesMap[mapping.pageId];
            if (!fileToUpload) return; // Guard: file reference missing locally

            try {
              await menuApi.uploadImageToS3(mapping.uploadUrl.replaceAll("172.18.0.2", "localhost"), fileToUpload); // TODO: Move that replacement fix to the backend, it shouldn't be here
            } catch (s3UploadError) {
              throw new Error(`S3_UPLOAD_FAILURE|${mapping.pageId}|${s3UploadError instanceof Error ? s3UploadError.message : ''}`);
            }
          })
        );

      console.log('✅🖼️  All images where successfully processed');
      }

      // 🎉 Update local snapshot memory references
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
        menuPages: finalSnapshotPages.map(p => ({ 
          pageId: p.pageId,
          imageUrl: p.imageUrl,
          pageNumber:
          p.pageNumber })),

        dishes: currentDishes.map(d => ({
          id: d.id,
          name: d.name,
          imageUrl: '',
          priceCents: Math.round(parseFloat(d.cost || '0') * 100),                                                                        // TODO: Take care setting the dish for free
          prepTime: parseInt(d.prepTime || '0', 10),
          isOutOfStock: true,
          menuPageId: d.pageId,
          coordinateXInMenu: d.coordinateXInMenu,
          coordinateYInMenu: d.coordinateYInMenu,
          description: ''   //        and avoid instant preparation 
        }))
      };

      onImportedImageWithRemoteUrlsNeeded(finalSnapshotPages)

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