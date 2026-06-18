// 🖥️ Frontend App Working State Definitions
export interface MenuPage {
  pageId: string;
  imageUrl: string;
  pageNumber: number;
}

export interface DishItem {
  id: string;
  imageUrl: string;
  pageId: string; // References MenuPage.pageId
  coordinateXInMenu: number;
  coordinateYInMenu: number;
  name: string;
  cost: string; // Managed as a string text input inside UI (e.g., "14.99")
  prepTime: string; // Managed as a string text input inside UI (e.g., "15")
  createdAt: number;
}

// ☁️ Cloud Sync Payload Specifications
export interface CloudMenuPagePayload {
  pageId: string;
  imageUrl: string; // TODO: Maybe this shouln'd be url but key
  pageNumber: number;
}

export interface CloudDishPayload {
  id: string;
  name: string;
  imageUrl: string; // TODO: Maybe this shouln'd be url but key
  priceCents: number;
  prepTime: number;
  isOutOfStock: boolean;
  menuPageId: string;
  coordinateXInMenu: number;
  coordinateYInMenu: number;
  description: string;
}

export interface CloudMenuGetPayload {
  menuPages: CloudMenuPagePayload[];
  dishes: CloudDishPayload[];
}

// 🚀 Delta Diff Request Parameter Structures
export interface CloudMenuDiffPayload {
  menuPages: Array<
    | { pageId: string; action: 'save'; pageNumber: number; imageUrl: string }
    | { pageId: string; action: 'update'; updatedFields: Partial<CloudMenuPagePayload> }
    | { pageId: string; action: 'delete' }
  >;
  dishes: Array<
    | ({ id: string; action: 'save' } & Omit<CloudDishPayload, 'action'>)
    | { id: string; action: 'update'; updatedFields: Partial<CloudDishPayload> }
    | { id: string; action: 'delete' }
  >;
}