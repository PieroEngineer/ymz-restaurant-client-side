import type { CloudDishItemPayload, CloudMenuDiffPayload } from "@/features/menu/types/api.types";
import type { DishItem, Menu, MenuPage } from '@/features/menu/types/domain.types';


export const checkMinimalDiff = (localPages: MenuPage[], localDishes: DishItem[], dbSnapshot: Menu): boolean => {
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

        return snap.name !== cd.name ||
          snap.priceCents !== cd.priceCents ||
          snap.prepTime !== cd.prepTime ||
          snap.coordinateXInMenu !== cd.coordinateXInMenu ||
          snap.coordinateYInMenu !== cd.coordinateYInMenu ||
          snap.parentPageId !== cd.parentPageId;  /// Is this line necessary? Maybe it's always false
      });

      return isPagesChanged || isDishesChanged;
}

export const generateDiffPayload = (currentPages: MenuPage[], currentDishes: DishItem[], dbSnapshot: Menu): CloudMenuDiffPayload => {
    // 📝 Build the Delta JSON Diff Document using the new S3 links
    const diffPayload: CloudMenuDiffPayload = { menuPages: [], dishes: [] };

    if (dbSnapshot != null) {
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
    
            if (!original) {  // For a dish totally modified
            diffPayload.dishes.push({
                id: cd.id,
                action: 'save',
                name: cd.name,
                imageUrl: cd.imageUrl, 
                priceCents: cd.priceCents,
                prepTime: cd.prepTime,
                isOutOfStock: true, // Preset parameter enforcement rule
                menuPageId: cd.parentPageId,
                coordinateXInMenu: cd.coordinateXInMenu,
                coordinateYInMenu: cd.coordinateYInMenu,
                description: '', // Preset parameter enforcement rule
                createdAt: cd.createdAt /// Or Date.now()?
            });
            } else {  // For a dish partially modified
                const updatedFields: Partial<CloudDishItemPayload> = {};
                if (original.name !== cd.name) updatedFields.name = cd.name;
                if (original.priceCents !== cd.priceCents) updatedFields.priceCents = cd.priceCents;
                if (original.prepTime !== cd.prepTime) updatedFields.prepTime =cd. prepTime;
                if (original.coordinateXInMenu !== cd.coordinateXInMenu) updatedFields.coordinateXInMenu = cd.coordinateXInMenu;
                if (original.coordinateYInMenu !== cd.coordinateYInMenu) updatedFields.coordinateYInMenu = cd.coordinateYInMenu;
                if (original.parentPageId !== cd.parentPageId) updatedFields.menuPageId = cd.parentPageId;  /// Is it possible? perhaps this line is unnecessary
                /// Is it necessary to include  "createAt"?
                
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
    }

    return diffPayload;

}