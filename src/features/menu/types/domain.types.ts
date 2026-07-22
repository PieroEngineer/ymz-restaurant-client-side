
export interface MenuPage {
  pageId: string;
  imageUrl: string;
  pageNumber: number;
}

export interface DishItem { // TODO: Moving to this 
  id: string;
  name: string;
  imageUrl: string;
  priceCents: number;
  prepTime: number;
  isOutOfStock: boolean;
  parentPageId: string; // References MenuPage.pageId
  coordinateXInMenu: number;
  coordinateYInMenu: number;  /// Consider move them to tuples
  description: string;
  createdAt: number;
}

export interface Menu{
  menuPages: MenuPage[];
  dishes: DishItem[];
}

