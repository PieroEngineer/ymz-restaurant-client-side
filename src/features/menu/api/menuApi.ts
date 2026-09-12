import { axiosClient } from '@/shared/api/axiosClient';
import type { CloudMenuDiffPayload, CloudMenuGetPayload, SyncDataFirstResponse } from '@/features/menu/types/api.types';
import { toDomainMenu } from '@/features/menu/api/mappers/inboundMappers';
import type { Menu } from '@/features/menu/types/domain.types';
import type { QueryFunctionContext } from '@tanstack/react-query';
import type { MenuQueryKey } from '@/features/menu/types/query.types';

export const menuApi = {

  /**
   * Pulls the current saved state payload profile out of the cloud database
   */
  async FetchMenuDataset({ queryKey }: QueryFunctionContext<MenuQueryKey>): Promise<Menu> {
    const [, , { restaurantId }] = queryKey;
  
    const response = await axiosClient.get<CloudMenuGetPayload>(`restaurants/${restaurantId}/menu`);

    return toDomainMenu(response.data);
  },

  /**
   * Pushes the optimized delta changes package to the cloud processing services
   */
  async pushMenuDeltaChanges(payload: CloudMenuDiffPayload, restaurantId: string): Promise<SyncDataFirstResponse> {

    // Axios handles stringifying the JSON payload body automatically
    const response = await axiosClient.post<SyncDataFirstResponse>(`restaurants/${restaurantId}/menu`, payload);

    return response.data;
  },

  /**
   * ☁️ HOP 2: Upload direct file binary to S3 using the newly generated pre-signed token URL
   */ // TODO: Consider to move it to the shared apis
  async uploadImageToS3(presignedUploadUrl: string, file: File): Promise<void> {  //TODO: handle it with fresh Axios clients ()

    console.log("🔎  Uploading file to S3 with presigned URL:", presignedUploadUrl);

    const response = await fetch(presignedUploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type }, // Enforce exact content type matching for AWS Signature S3 validity
      body: file
    });

    console.log("🔎  S3 upload response status:", response.status);

    if (!response.ok) {
      throw new Error(`🔴  Direct S3 (With CDN) binary allocation failed with status code: ${response.status}`);
    }
  },

};