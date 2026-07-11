import { useState } from "react";
import { validateDishFields, validateEmptyPages } from "@/features/menu/helpers/menuValidators";
import type { MenuModalMode } from "@/features/menu/types/support/menuEditor.types";
import type { DishItem, MenuPage } from "@/features/menu/types/domain.types";
import type { InvalidDishDetail } from "@/features/menu/types/support/validation.types";


export function useModalValidation(menuPages: MenuPage[], dishes: DishItem[], onImageRemoved: () => void, onUploadMenu: () =>void){
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<MenuModalMode>(null);
    const [emptyPagesData, setEmptyPagesData] = useState<number[]>([]);
    const [invalidDishesData, setInvalidDishesData] = useState<InvalidDishDetail[]>([]);

    return {
    modalOpen,

    modalMode,

    emptyPagesData,

    invalidDishesData,

    onAttemptSync: () => {
        const dishCheck = validateDishFields(menuPages, dishes);
            if (!dishCheck.isValid) {
                setInvalidDishesData(dishCheck.invalidDishes);
                setModalMode('INVALID_DISHES');
                setModalOpen(true);
                return;
            }
            const pageCheck = validateEmptyPages(menuPages, dishes);
            if (!pageCheck.isValid) {
                setEmptyPagesData(pageCheck.emptyPageNumbers);
                setModalMode('EMPTY_PAGES');
                setModalOpen(true);
                return;
            }
            setModalMode('CONFIRM_SYNC');
            setModalOpen(true);
    },

    onConfirmSync: () => {
        setModalOpen(false);
        switch (modalMode) {
        case 'CONFIRM_DELETE':
            onImageRemoved();
            break;
        case 'CONFIRM_SYNC':
        case 'EMPTY_PAGES':
            onUploadMenu();
            break;
        default:
            break;
        }
    },

    onConfirmDeletition: () => {
        if (menuPages.length === 0) return;
        setModalMode('CONFIRM_DELETE');
        setModalOpen(true);
    },

    onCloseFrame: () => setModalOpen(false)
    }
}