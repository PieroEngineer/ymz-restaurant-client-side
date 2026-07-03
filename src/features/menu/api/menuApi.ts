import type { CloudDishPayload, CloudMenuGetPayload, CloudMenuDiffPayload, DishItem, MenuPage, CloudMenuPagePayload } from '@/features/menu/types/sync.types';
import { api } from '@/shared/api/axiosClient';

// 🧪 Testing Parameters Configuration Placeholders
const TEMP_RESTAURANT_ID = '4258e0fa-6b3c-43bc-a6d8-82c5835d608d';
//X const BASE_API_URL = `http://localhost:4566/_aws/execute-api/p0hhtkb1so/prod/restaurants/${TEMP_RESTAURANT_ID}/menu`;

// 📦 Added structural types specifically for the new multi-hop transaction response
export interface PresignedUrlMapping {
  pageId: string;
  uploadUrl: string; // The temporary pre-signed token URL to execute the PUT binary request
  publicUrl: string; // The final permanent public read URL that will be saved in DynamoDB
}

export interface SyncDataFirstResponse {
  message: string;
  // The backend returns an array of upload tokens only for the pages that requested a 'save' or 'update' action
  presignedUrls: PresignedUrlMapping[];
}

export const menuApi = {

  /**
   * Pulls the current saved state payload profile out of the cloud database
   */
  async fetchMenuDataset(): Promise<{ pages: MenuPage[]; dishes: DishItem[] }> {
  
    const response = await api.get<CloudMenuGetPayload>(`restaurants/${TEMP_RESTAURANT_ID}/menu`);

    return { 
      pages: mapToMenuPages(response.data.menuPages), 
      dishes: mapTodishes(response.data.dishes) 
    };
  },

  /**
   * Pushes the optimized delta changes package to the cloud processing services
   */
  async pushMenuDeltaChanges(payload: CloudMenuDiffPayload): Promise<SyncDataFirstResponse> {

    // Axios handles stringifying the JSON payload body automatically
    const response = await api.post<SyncDataFirstResponse>(`restaurants/${TEMP_RESTAURANT_ID}/menu`, payload);

    return response.data;
  },

   /**
   * ☁️ HOP 2: Upload direct file binary to S3 using the newly generated pre-signed token URL
   */
  async uploadImageToS3(presignedUploadUrl: string, file: File): Promise<void> {  //TODO: handle it with fresh Axios clients ()
    console.log('🔎  file.type', file.type)

    const response = await fetch(presignedUploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type }, // Enforce exact content type matching for AWS Signature S3 validity
      body: file
    });

    if (!response.ok) {
      throw new Error(`🔴  Direct S3 binary allocation failed with status code: ${response.status}`);
    }
  },
};

const mapToMenuPages = (cloudPages: CloudMenuPagePayload[]): MenuPage[] => {
  return cloudPages.map(p => ({
          pageId: p.pageId,
          imageUrl: p.imageUrl,
          pageNumber: p.pageNumber
        }));
} 

const mapTodishes = (cloudDishes: CloudDishPayload[]): DishItem[] => {
  return cloudDishes.map(d => ({
          id: d.id,
          pageId: d.menuPageId,
          imageUrl: d.imageUrl,
          coordinateXInMenu: d.coordinateXInMenu,
          coordinateYInMenu: d.coordinateYInMenu,
          name: d.name,
          cost: (d.priceCents / 100).toFixed(2),
          prepTime: d.prepTime.toString(),
          createdAt: Date.now()
        }));
}  
