import type { CloudDishPayload, CloudMenuDiffPayload, CloudMenuGetPayload, DishItem, MenuPage } from "@/features/menu/types/sync.types";

export const checkMinimalDiff = (localPages: MenuPage[], localDishes: DishItem[], dbSnapshot: CloudMenuGetPayload): boolean => {
  // Build operational comparison arrays
    const isPagesChanged = localPages.length !== dbSnapshot.menuPages.length ||
      localPages.some(cp => {
        const snap = dbSnapshot.menuPages.find(p => p.pageId === cp.pageId);
        if (!snap) return true;
        return snap.imageUrl !== cp.imageUrl || snap.pageNumber !== cp.pageNumber;
      });

    const isDishesChanged = localDishes.length !== dbSnapshot.dishes.length ||
      localDishes.some(cd => {
        const snap = dbSnapshot.dishes.find(d => d.id === cd.id);
        if (!snap) return true;
        
        const priceCents = Math.round(parseFloat(cd.cost || '0') * 100);
        const prepTime = parseInt(cd.prepTime || '0', 10);

        return snap.name !== cd.name ||
          snap.priceCents !== priceCents ||
          snap.prepTime !== prepTime ||
          snap.coordinateXInMenu !== cd.coordinateXInMenu || //TODO: Verify if "1" it's a good threshold (It's better if everyone works with the same normalization "%")
          snap.coordinateYInMenu !== cd.coordinateYInMenu ||
          snap.menuPageId !== cd.pageId;  /// Is this line necessary? Maybe it's always false
      });

      return isPagesChanged || isDishesChanged;
}

export const generateDiffPayload = (currentPages: MenuPage[], currentDishes: DishItem[], dbSnapshot: CloudMenuGetPayload): CloudMenuDiffPayload => {
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

    return diffPayload;
}