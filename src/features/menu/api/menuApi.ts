import { axiosClient } from '@/shared/api/axiosClient';
import type { CloudMenuDiffPayload, CloudMenuGetPayload, SyncDataFirstResponse } from '@/features/menu/types/api.types';
import { toDomainMenu } from '@/features/menu/api/mappers/inboundMappers';
import type { Menu } from '@/features/menu/types/domain.types';

// 🧪 Testing Parameters Configuration Placeholders
export const MOCK_MENU_RESTAURANT_ID = '4258e0fa-6b3c-43bc-a6d8-82c5835d608d';

export const menuApi = {

  /**
   * Pulls the current saved state payload profile out of the cloud database
   */
  async FetchMenuDataset(): Promise<Menu> {

    console.log('🔎📥  There was a request to fetch the menu dataset for restaurant:', MOCK_MENU_RESTAURANT_ID)
  
    const response = await axiosClient.get<CloudMenuGetPayload>(`restaurants/${MOCK_MENU_RESTAURANT_ID}/menu`);

    console.log('🔎📥 Its answer was:\n', response)

    return toDomainMenu(response.data);
  },

  /**
   * Pushes the optimized delta changes package to the cloud processing services
   */
  async pushMenuDeltaChanges(payload: CloudMenuDiffPayload): Promise<SyncDataFirstResponse> {

    // Axios handles stringifying the JSON payload body automatically
    const response = await axiosClient.post<SyncDataFirstResponse>(`restaurants/${MOCK_MENU_RESTAURANT_ID}/menu`, payload);

    return response.data;
  },

  /**
   * ☁️ HOP 2: Upload direct file binary to S3 using the newly generated pre-signed token URL
   */
  async uploadImageToS3(presignedUploadUrl: string, file: File): Promise<void> {  //TODO: handle it with fresh Axios clients ()

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