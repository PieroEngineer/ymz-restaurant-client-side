import { useMutation } from '@tanstack/react-query';
import { menuApi } from '@/features/menu/api/menuApi';
import type { DishItem, Menu, MenuPage } from '@/features/menu/types/domain.types';
import { generateDiffPayload } from '@/features/menu/helpers/menuComparators';
import { injectRemoteUrlInPages } from '@/features/menu/helpers/handleRemoteUrls';
import { useMemo, useState } from 'react';
import { sortDishesWithOrderNumbers } from '@/features/menu/helpers/menuDishHelpers';
import type { EditableDishField } from '@/features/menu/types/support/selection.types';
import { ensureCostFormat } from '@/features/menu/helpers/moneyValidators';

export function useMenuDraft(initialMenu: Menu | undefined, localPageFiles: Record<string, File> = {}, onResetLocalImageMap: () => void) {
  const [draftMenuPages, setMenuPagesDraft] = useState(initialMenu?.menuPages ?? [])
  const [draftDishItems, setDishItensDraft] = useState(initialMenu?.dishes ?? [])
  
  const {mutate, isPending} = useMutation({
    mutationFn: async () => {
      if(initialMenu ===undefined) return []

      const diffPayload = generateDiffPayload(draftMenuPages, draftDishItems, initialMenu);
      
      let syncResponseData: Awaited<ReturnType<typeof menuApi.pushMenuDeltaChanges>> | null = null;
    
        syncResponseData = await menuApi.pushMenuDeltaChanges(diffPayload);

        if (syncResponseData.presignedUrls && syncResponseData.presignedUrls.length > 0) {
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
    
        return syncResponseData.presignedUrls ?? []

    },
    onSuccess: (presignedUrls) => {
        const finalSnapshotPages = injectRemoteUrlInPages(
          draftMenuPages,
          presignedUrls ?? [],
        );

        console.log('🔎  Page data now', draftMenuPages);
        console.log('🔎  Dishe data now', draftDishItems);
    
        setMenuPagesDraft(finalSnapshotPages)
        onResetLocalImageMap()
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
    dishesWithOrder: useMemo( () => sortDishesWithOrderNumbers(draftDishItems, draftMenuPages), [draftDishItems, draftMenuPages]),

    draftMenuPages,

    draftDishItems,

    isUploading: isPending,

    onUploadMenu: () => mutate,

    onAddNewDish: (newDish: DishItem) => setDishItensDraft((prev) => [...prev, newDish]),
    
    onAddNewPages: (newPages: MenuPage[]) => setMenuPagesDraft((prev) => [...prev, ...newPages]),

    onRemoveDish: (dishIdToDestroy: string) => setDishItensDraft((prevDishes) => prevDishes.filter((dish) => dish.id !== dishIdToDestroy)),

    onRemovePage: (pageIdToDestroy: string) => {
      setDishItensDraft((prevDishes) => prevDishes.filter((dish) => dish.parentPageId !== pageIdToDestroy));

      setMenuPagesDraft((prevPages) => {
        const filtered = prevPages.filter((page) => page.pageId !== pageIdToDestroy);
        return filtered.map((page, index) => ({
          ...page,
          pageNumber: index + 1,
        }));
      });
    },

    onUpdateDishData: (id: string, field: EditableDishField, value: string, fallbackValue = 0) => {
      console.log('🔎  The field to save is ', field, ' has the value ', value, ' whose type is ', typeof value);

      let savedValue: string | number
      // Ensuring the field match with the type   // TODO: Find another path where the 
      switch(field){
        case "name":
        case "prepTime":
          savedValue = value;
          break;
        case "priceCents":
          savedValue = parseFloat(ensureCostFormat(value)) || fallbackValue;
          break;
      }

      setDishItensDraft((prev) =>
        prev.map((dish) => (dish.id === id ? { ...dish, [field]: savedValue } : dish)),
      );
    },

    onUpdateDishCoordinates: (dishId: string, newX: number, newY: number) => {
      setDishItensDraft(
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
