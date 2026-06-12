import { useState, useEffect } from 'react';
import type { MenuPage, DishItem, CloudMenuGetPayload, CloudMenuDiffPayload, CloudDishPayload } from '@/features/menu/types/sync.types';
import { menuApi } from '@/features/menu/api/menuApi';

export type SyncStatusType = 'Synchronized' | 'Loading' | 'Unsynchronized'; //TODO: Expand to more states like "Uploading", "downloading", etc. The change is easy in the "SyncStatusIndicator", just add the state design.

export function useMenuSync(
  currentPages: MenuPage[],
  currentDishes: DishItem[],
  onInitializeData: (pages: MenuPage[], dishes: DishItem[]) => void
) {
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>('Loading');
  
  // 💾 Core Immutable Baseline Storage Snapshot
  const [dbSnapshot, setDbSnapshot] = useState<CloudMenuGetPayload>({
    menuPages: [],
    dishes: []
  });

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
          xPercent: d.coordinateXInMenu*100,
          yPercent: d.coordinateYInMenu*100,
          name: d.name,
          cost: (d.priceCents / 100).toFixed(2),
          prepTime: d.prepTime.toString(),
          createdAt: Date.now()
        }));

        // console.log('🔎  These maps came from backend', mappedPages)
        // console.log('🔎  These dishes came from backend', mappedDishes)

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

        return snap.name !== cd.name ||
          snap.priceCents !== priceCents ||
          snap.prepTime !== prepTime ||
          snap.coordinateXInMenu !== cd.xPercent/100 ||
          snap.coordinateYInMenu !== cd.yPercent/100 ||
          snap.menuPageId !== cd.pageId;
      });

    if (isPagesChanged || isDishesChanged) {
      setSyncStatus('Unsynchronized');
    } else {
      setSyncStatus('Synchronized');
    }
  }, [currentPages, currentDishes, dbSnapshot]);

  // 🚀 Phase 3: Analytical Object Diffing Engine Operation
  const synchronizeDatasetChanges = async () => {
    if (syncStatus !== 'Unsynchronized') return;
    setSyncStatus('Loading');

    try {
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
            diffPayload.menuPages.push({ id: cp.pageId, action: 'update', updatedFields });
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

        if (!original) {
          diffPayload.dishes.push({
            id: cd.id,
            action: 'save',
            name: cd.name,
            imageUrl: cd.imageUrl, 
            priceCents,
            prepTime,
            isOutOfStock: true, // Preset parameter enforcement rule
            menuPageId: cd.pageId,
            coordinateXInMenu: cd.xPercent/100,
            coordinateYInMenu: cd.yPercent/100,
            description: '' // Preset parameter enforcement rule
          });
        } else {
          const updatedFields: Partial<CloudDishPayload> = {};
          if (original.name !== cd.name) updatedFields.name = cd.name;
          if (original.priceCents !== priceCents) updatedFields.priceCents = priceCents;
          if (original.prepTime !== prepTime) updatedFields.prepTime = prepTime;
          if (original.coordinateXInMenu !== cd.xPercent/100) updatedFields.coordinateXInMenu = cd.xPercent/100;
          if (original.coordinateYInMenu !== cd.yPercent/100) updatedFields.coordinateYInMenu = cd.yPercent/100;
          if (original.menuPageId !== cd.pageId) updatedFields.menuPageId = cd.pageId;

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

      console.log('🔎  Sent diff', diffPayload)

      // Commit transaction package to infrastructure
      await menuApi.pushMenuDeltaChanges(diffPayload);

      // 🔄 C. Re-normalize baseline snapshots on operational success
      const nextSnapshot: CloudMenuGetPayload = {
        menuPages: currentPages.map(p => ({ pageId: p.pageId, imageUrl: p.imageUrl, pageNumber: p.pageNumber })),
        dishes: currentDishes.map(d => ({
          id: d.id,
          name: d.name,
          imageUrl: '',
          priceCents: Math.round(parseFloat(d.cost || '0') * 100),  // TODO: Take care setting the dish for free
          prepTime: parseInt(d.prepTime || '0', 10),               //        and avoid instant preparation 
          isOutOfStock: true,
          menuPageId: d.pageId,
          coordinateXInMenu: d.xPercent/100,
          coordinateYInMenu: d.yPercent/100,
          description: ''
        }))
      };

      setDbSnapshot(nextSnapshot);
      setSyncStatus('Synchronized');
    } catch (err) {
      console.error('🔴  Critical database upload synchronization failure:', err);
      setSyncStatus('Unsynchronized');

      // 💡 Note: We do NOT clear or touch currentPages or currentDishes. 
      // The restaurant operator's local modifications remain safely on their screen!
    }
  };

  return { syncStatus, synchronizeDatasetChanges };
}