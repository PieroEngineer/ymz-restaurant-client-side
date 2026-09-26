import type { DishItem, MenuPage } from "@/features/menu/types/domain.types";

export function usePinCoordinate(
    activePageObject: MenuPage,

    onAddNewDish: (newPages: DishItem) => void,
    onRemoveDish: (dishIdToDestroy: string) => void,
    
    onActivateEditCell: (focusedId: string) => void,
    onHandleSomeCellRemoved: (removedDishId: string) => void,
    onUpdateDishCoordinates: (dishId: string, xPercent: number, yPercent: number) => void
){
    return {
        onAddNewCoordinate: (coords: {coordinateXInMenu: number, coordinateYInMenu: number}) => {
            if (!activePageObject) return;
            const newId = crypto.randomUUID();
            const newDishRecord: DishItem = {
                id: newId,
                name: '',
                imageUrl: '',
                priceCents: 0,
                prepTime: 0,
                isOutOfStock: false,    ///
                parentPageId: activePageObject.pageId,
                availableComplementaryDishIds: [],
                type: 'MAIN',
                ...coords,
                description: '',
                createdAt: Date.now(),
            };
            onAddNewDish(newDishRecord);
            onActivateEditCell(newId);
        },

        onDeleteCoordinate: (removedId: string) => {
            onRemoveDish(removedId);
            onHandleSomeCellRemoved(removedId);
        },

        onUpdateCoordinate: (id: string, xPercent: number, yPercent: number) => onUpdateDishCoordinates(id, xPercent, yPercent)
    }
}