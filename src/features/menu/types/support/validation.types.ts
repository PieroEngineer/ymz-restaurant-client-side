
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
//   orderNumber: number;   TODO: find the way to add the order number too
}