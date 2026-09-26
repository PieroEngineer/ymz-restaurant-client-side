import { useState } from 'react';
import type { DishItem } from '@/features/menu/types/domain.types';
import type { DishTypeToken } from '@/features/menu/types/support/selection.types';

type ExtraDetailsField = 'prepTime' | 'type' | 'availableComplementaryDishIds';
type ExtraDetailsValue = string | string[] | DishTypeToken;
type UpdateDishData = (id: string, field: ExtraDetailsField, value: ExtraDetailsValue) => void;

export function useExtraDetailsModal(dishes: DishItem[], onUpdateDishData: UpdateDishData) {
    const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
    const selectedDish = dishes.find((dish) => dish.id === selectedDishId) ?? null;
    const complementaryDishes = dishes.filter((dish) => dish.type === 'COMPLEMENTARY');
    const allComplementsSelected = complementaryDishes.length > 0 && selectedDish !== null &&
        complementaryDishes.every((complement) => selectedDish.availableComplementaryDishIds.includes(complement.id));

    const updateSelectedDish = (field: ExtraDetailsField, value: ExtraDetailsValue) => {
        if (selectedDish) onUpdateDishData(selectedDish.id, field, value);
    };

    return {
        isOpen: selectedDish !== null,
        selectedDish,
        complementaryDishes,
        allComplementsSelected,
        onSeeExtraDetails: (dish: DishItem) => setSelectedDishId(dish.id),
        onClose: () => setSelectedDishId(null),
        onUpdatePrepTime: (value: string) => updateSelectedDish('prepTime', value),
        onUpdateDishType: (value: DishTypeToken) => updateSelectedDish('type', value),
        onToggleComplement: (dishId: string, checked: boolean) => {
            if (!selectedDish) return;
            const selectedIds = selectedDish.availableComplementaryDishIds;
            const nextIds = checked
                ? [...new Set([...selectedIds, dishId])]
                : selectedIds.filter((id) => id !== dishId);
            updateSelectedDish('availableComplementaryDishIds', nextIds);
        },
        onToggleAllComplements: (checked: boolean) => updateSelectedDish(
            'availableComplementaryDishIds',
            checked ? complementaryDishes.map((dish) => dish.id) : [],
        ),
    };
}