import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '@/features/menu/api/menuApi';
import type { DishItem, Menu, MenuPage } from '@/features/menu/types/domain.types';
import { generateDiffPayload } from '@/features/menu/helpers/menuComparators';
import { injectRemoteUrlInPages } from '@/features/menu/helpers/handleRemoteUrls';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sortDishesWithOrderNumbers } from '@/features/menu/helpers/menuDishHelpers';
import type { EditableDishFieldType } from '@/features/menu/types/support/selection.types';
import type { DishTypeToken } from '@/features/menu/types/support/selection.types';
import { decimalToCents, ensureCostFormat } from '@/shared/utils/moneyConversors';
import type { MenuQueryKey } from '@/features/menu/types/query.types';

type DraftDishField = EditableDishFieldType | 'type' | 'availableComplementaryDishIds';
type DraftDishValue = string | boolean | string[] | DishTypeToken;

export function useMenuDraft(
  initialMenu: Menu | undefined,
  localPageFiles: Record<string,
  File> = {},
  onResetLocalImageMap: () => void,
  loggedRestaurantId: string | undefined
) {

  const queryClient = useQueryClient();
  
  const [syncMenu, useSyncMenu] = useState<Menu>({menuPages: [], dishes: []}) // TODO (#739): Maybe it can be replaced by the state of TanStack Query

  const [draftMenuPages, setMenuPagesDraft] = useState<MenuPage[]>([])
  const [draftDishItems, setDishItemsDraft] = useState<DishItem[]>([])
  
  const hasInitialized = useRef(false);
  
  useEffect(() => { // It's expected valid use of "useCase" only because the async source run once a mount
    if (initialMenu !== undefined && !hasInitialized.current) {
      useSyncMenu(initialMenu)
      setDishItemsDraft(initialMenu.dishes);
      setMenuPagesDraft(initialMenu.menuPages);
      hasInitialized.current = true; // ref, not state — this flag itself shouldn't trigger re-renders
    }
  }, [initialMenu]);  /// This useEffect does a good job while "InitialMenu" only runs once a mount

  const {mutate, isPending, isError} = useMutation({
    mutationFn: async () => {
      console.log('⬆️  Trying to upload data')
      if(initialMenu ===undefined) return []
      if(loggedRestaurantId === undefined) return
      
      const diffPayload = generateDiffPayload(draftMenuPages, draftDishItems, initialMenu);
      
      console.log('⬆️  The diff to send is\n', diffPayload)
    
      const syncResponseData = await menuApi.pushMenuDeltaChanges(diffPayload, loggedRestaurantId);

      if (syncResponseData.presignedUrls && syncResponseData.presignedUrls.length > 0) {
        console.log('🔎  Starting the upload the images')

        await Promise.all(
          syncResponseData.presignedUrls.map(async (mapping) => {
            const fileToUpload = localPageFiles[mapping.pageId];
            if (!fileToUpload) return;
  
            try {
              await menuApi.uploadImageToS3(
                mapping.uploadUrl.replaceAll('172.18.0.2', 'localhost'),
                fileToUpload,
              );
            } catch (s3UploadError) {
              throw new Error(
                `S3_UPLOAD_FAILURE|${mapping.pageId}|${s3UploadError instanceof Error ? s3UploadError.message : ''}`,
              );
            }
          }),
        );
  
        console.log('✅🖼️  All images where successfully processed');
      }
      else{
        console.log('⚠️🔎  The upload the images could not start', syncResponseData.presignedUrls )
      }
  
      return syncResponseData.presignedUrls ?? []

    },
    onSuccess: (presignedUrls) => {
      const finalSnapshotPages = injectRemoteUrlInPages(
        draftMenuPages,
        presignedUrls ?? [],
      );
      console.log('  Page data now', draftMenuPages);
      console.log('  Dishe data now', draftDishItems);
      
      setMenuPagesDraft(finalSnapshotPages);
      
      const committedMenu = { menuPages: finalSnapshotPages, dishes: draftDishItems };
      useSyncMenu(committedMenu); // TODO (#739)
      if (loggedRestaurantId) {

        const menuQueryKey: MenuQueryKey = ['menu', 'dataset', { restaurantId: loggedRestaurantId }]
        queryClient.setQueryData(
          menuQueryKey,
          committedMenu,
        );
      }
      
      onResetLocalImageMap();
    },
    onError: () =>{
      // console.error('🔴  Critical database upload synchronization failure:', err);
    
      //   const errorMessage = err instanceof Error ? err.message : '';
    
      //   if (syncResponseData !== null && errorMessage.startsWith('S3_UPLOAD_FAILURE')) {
      //     console.warn('⚠️ Metadata saved but binary upload failed. Possible ghost items in backend...');
      //   }
    
      //   throw err;
    }
  });

  return {
    syncMenu,

    dishesWithOrderNumbers: useMemo( () => sortDishesWithOrderNumbers(draftDishItems, draftMenuPages), [draftDishItems, draftMenuPages]),

    draftMenuPages,

    draftDishItems,

    isUploading: isPending,

    isErrorInUpload: isError,

    onUploadMenu: () => mutate(),

    onAddNewDish: (newDish: DishItem) => setDishItemsDraft((prev) => [...prev, newDish]),
    
    onAddNewPages: (newPages: MenuPage[]) => setMenuPagesDraft((prev) => [...prev, ...newPages]),

    onRemoveDish: (dishIdToDestroy: string) => setDishItemsDraft((prevDishes) => prevDishes.filter((dish) => dish.id !== dishIdToDestroy)),

    onRemovePage: (pageIdToDestroy: string) => {
      setDishItemsDraft((prevDishes) => prevDishes.filter((dish) => dish.parentPageId !== pageIdToDestroy));

      setMenuPagesDraft((prevPages) => {
        const filtered = prevPages.filter((page) => page.pageId !== pageIdToDestroy);
        return filtered.map((page, index) => ({
          ...page,
          pageNumber: index + 1,
        }));
      });
    },

    onUpdateDishData: (id: string, field: DraftDishField, anyValue: DraftDishValue, fallbackValue = 0) => {

      let savedValue: string | number | boolean | string[] | DishTypeToken;
      // Ensuring the field match with the type   // TODO: Find another path where the 
      switch(field){
        case "name":
          savedValue = String(anyValue);
          break;
        case "prepTime":
          savedValue = Math.max(0, Number.parseInt(String(anyValue), 10) || 0);
          break;
        case "priceCents":
          savedValue = decimalToCents(parseFloat(ensureCostFormat(String(anyValue))) || fallbackValue);
          break;
        case "isOutOfStock":
          savedValue = Boolean(anyValue);
          break;
        case "type":
          savedValue = anyValue as DishTypeToken;
          break;
        case "availableComplementaryDishIds":
          savedValue = Array.isArray(anyValue) ? anyValue : [];
          break;
      }

      if(field==='type' && savedValue === "MAIN"){
        setDishItemsDraft((prev) =>
          prev.map((dish) => 
            ( dish.availableComplementaryDishIds.includes(id) ? 
              { 
                ...dish,
                availableComplementaryDishIds: dish.availableComplementaryDishIds.filter(complementaryDishId => complementaryDishId!==id) 
              } :
              dish
            )
          ),
        );
      }

      setDishItemsDraft((prev) =>
        prev.map((dish) => (dish.id === id ? { ...dish, [field]: savedValue } : dish)),
      );
    },

    onUpdateDishCoordinates: (dishId: string, newX: number, newY: number) => {
      setDishItemsDraft(
          (prev) =>
          prev.map((dish) =>
              dish.id === dishId
              ? { ...dish, coordinateXInMenu: newX, coordinateYInMenu: newY }
              : dish,
          )
      );
    },

    onReplacePage: (targetPageId: string, newLocalUrl: string) => setMenuPagesDraft((prevPages) =>
      prevPages.map((page) =>
        page.pageId === targetPageId ? { ...page, imageUrl: newLocalUrl } : page,
      ),
    )
  }
}
