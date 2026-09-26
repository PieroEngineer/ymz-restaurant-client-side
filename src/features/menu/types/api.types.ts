import type { DishTypeToken } from "@/features/menu/types/support/selection.types";

// ===== Input Formats =====
export interface CloudMenuPagePayload {
  pageId: string;
  imageUrl: string; // TODO: Maybe this shouln'd be url but key
  pageNumber: number;
}

export interface CloudDishItemPayload {
  id: string;
  name: string;
  imageUrl: string; // TODO: Maybe this shouln'd be url but key
  priceCents: number;
  prepTime: number;
  isOutOfStock: boolean;
  menuPageId: string;
  coordinateXInMenu: number;
  coordinateYInMenu: number;  ///
  availableComplementaryDishIds: string[];
  type: DishTypeToken;
  description: string;
  createdAt: number;
}

export interface CloudMenuGetPayload {
  menuPages: CloudMenuPagePayload[];  // TODO: Don't send imageUrl when updating
  dishes: CloudDishItemPayload[];
}

// ===== Response formats =====

export interface SyncDataFirstResponse {
  message: string;
  // The backend returns an array of upload tokens only for the pages that requested a 'save' or 'update' action
  presignedUrls: PresignedUrlMapping[];
}

export interface PresignedUrlMapping {    // Added structural types specifically for the new multi-hop transaction response
  pageId: string;
  uploadUrl: string; // The temporary pre-signed token URL to execute the PUT binary request
  publicUrl: string; // The final permanent public read URL that will be saved in DynamoDB
}

// ===== Output Formats =====

// Delta Diff Request Parameter Structures
export interface CloudMenuDiffPayload {
  menuPages: Array<
    | { pageId: string; action: 'save'; pageNumber: number; imageUrl: string }
    | { pageId: string; action: 'update'; updatedFields: Partial<CloudMenuPagePayload> }
    | { pageId: string; action: 'delete' }
  >;
  dishes: Array<
    | ({ id: string; action: 'save' } & Omit<CloudDishItemPayload, 'action'>)
    | { id: string; action: 'update'; updatedFields: Partial<CloudDishItemPayload> }
    | { id: string; action: 'delete' }
  >;
}