import type { MenuPage, DishItem } from '@/features/menu/types/sync.types';

export interface EmptyPageValidationResult {
  isValid: boolean;
  emptyPageNumbers: number[]; // e.g., [2, 5]
}

export interface DishValidationResult {
  isValid: boolean;
  invalidDishes: InvalidDishDetail[];
}

export interface InvalidDishDetail {
  dishName: string;
  pageNumber: number;
  missingFields: string[];
}


/**
 * 🔍 Rule 1: Scans for any menu page that has zero attached dish coordinate pins
 */
export const validateEmptyPages = (pages: MenuPage[], dishes: DishItem[]): EmptyPageValidationResult => {
  const emptyPageNumbers: number[] = [];

  pages.forEach((page) => {
    const hasDishes = dishes.some((dish) => dish.pageId === page.pageId);
    if (!hasDishes) {
      emptyPageNumbers.push(page.pageNumber);
    }
  });

  // Sort page numbers ascending for cleaner string display formatting later
  emptyPageNumbers.sort((a, b) => a - b);

  return {
    isValid: emptyPageNumbers.length === 0,
    emptyPageNumbers,
  };
};

/**
 * 🔍 Rule 2: Scans all dishes for missing text fields (Name, Cost, Prep Time)
 */
export const validateDishFields = (pages: MenuPage[], dishes: DishItem[]): DishValidationResult => {
  const invalidDishes: InvalidDishDetail[] = [];

  dishes.forEach((dish) => {
    const parentPage = pages.find((p) => p.pageId === dish.pageId);
    const pageNum = parentPage ? parentPage.pageNumber : 0;

    const missingFields: string[] = [];
    
    // Check fields using clean trim assertions
    if (!dish.name || dish.name.trim() === '') missingFields.push('Name');
    if (!dish.cost || dish.cost.trim() === '' || parseFloat(dish.cost) === 0) missingFields.push('Price');
    if (!dish.prepTime || dish.prepTime.trim() === '' || parseInt(dish.prepTime, 10) === 0) missingFields.push('Prep Time');

    if (missingFields.length > 0) {
      // If ALL fields are missing, we will capture a clean label to avoid text overload
      const isCompletelyEmpty = missingFields.length === 3;
      
      invalidDishes.push({
        dishName: isCompletelyEmpty ? 'Unfilled Dish Pin' : (dish.name || 'Unnamed Dish'),
        pageNumber: pageNum,
        missingFields: isCompletelyEmpty ? ['All fields are empty'] : missingFields,
      });
    }
  });

  return {
    isValid: invalidDishes.length === 0,
    invalidDishes,
  };
};

/**
 * 📝 Helper utility to format numbers into a grammatically correct string list 
 * e.g., [2] -> "Page 2" | [2, 3] -> "Pages 2 and 3" | [2, 3, 4] -> "Pages 2, 3 and 4"
 */
export const formatPageNumbersList = (numbers: number[]): string => {
  if (numbers.length === 0) return '';
  if (numbers.length === 1) return `Page ${numbers[0]}`;
  
  const last = numbers[numbers.length - 1];
  const rest = numbers.slice(0, -1);
  return `Pages ${rest.join(', ')} and ${last}`;
};