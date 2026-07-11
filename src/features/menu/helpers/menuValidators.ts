import type { MenuPage, DishItem } from '@/features/menu/types/domain.types';
import type { DishValidationResult, EmptyPageValidationResult, InvalidDishDetail } from '@/features/menu/types/support/validation.types';

/**
 * 🔍 Rule 1: Scans for any menu page that has zero attached dish coordinate pins
 */
export const validateEmptyPages = (pages: MenuPage[], dishes: DishItem[]): EmptyPageValidationResult => {
  const emptyPageNumbers: number[] = [];

  pages.forEach((page) => {
    const hasDishes = dishes.some((dish) => dish.parentPageId === page.pageId);
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
    const parentPage = pages.find((p) => p.pageId === dish.parentPageId);
    const pageNum = parentPage ? parentPage.pageNumber : 0;

    const missingFields: string[] = [];
    
    // Check fields using clean trim assertions
    if (!dish.name || dish.name.trim() === '') missingFields.push('Nombre');
    if (!dish.priceCents || dish.priceCents.toString() === '' || dish.priceCents === 0) missingFields.push('Precio');
    if (!dish.prepTime || dish.prepTime.toString() === '' || dish.prepTime === 0) missingFields.push('Tiempo de preparación');

    if (missingFields.length > 0) {
      // If ALL fields are missing, we will capture a clean label to avoid text overload
      const isCompletelyEmpty = missingFields.length === 3; // TODO: try to avoid the harcoding of the number of editable columns
      
      invalidDishes.push({
        dishName: dish.name || '',  // TODO: put the order number here
        pageNumber: pageNum,
        missingFields: isCompletelyEmpty ? ['Todos los campos están vacíos'] : missingFields,
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
export const formatPageNumbersList = (numbers: number[]): string => {   // TODO: improve it (See in page to see how it looks)
  if (numbers.length === 0) return '';
  if (numbers.length === 1) return `La página ${numbers[0]} no tiene`;
  
  const last = numbers[numbers.length - 1];
  const rest = numbers.slice(0, -1);
  return `Las páginas ${rest.join(', ')} y ${last} no tienen`;
};

//TODO: Add for dish message too