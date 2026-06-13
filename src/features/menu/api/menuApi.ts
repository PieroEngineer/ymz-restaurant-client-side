import type { CloudMenuGetPayload, CloudMenuDiffPayload } from '@/features/menu/types/sync.types';

// 🧪 Testing Parameters Configuration Placeholders
const TEMP_RESTAURANT_ID = '4258e0fa-6b3c-43bc-a6d8-82c5835d608d';
const BASE_API_URL = `http://localhost:4566/_aws/execute-api/cpynybwxmi/prod/restaurants/${TEMP_RESTAURANT_ID}/menu`;

export const menuApi = {
  /**
   * Pulls the current saved state payload profile out of the cloud database
   */
  async fetchMenuDataset(): Promise<CloudMenuGetPayload> {
    
    // In an operational pipeline, replace this with your direct fetch logic:
    const response = await fetch(BASE_API_URL);
    
    // 🛡️ Guard: If server returns 500, 404, etc., force it into the catch block
    if (!response.ok) throw new Error(`🔴  GET Request Failed with status: ${response.status}`);

    return response.json();
  },

  /**
   * Pushes the optimized delta changes package to the cloud processing services
   */
  async pushMenuDeltaChanges(payload: CloudMenuDiffPayload): Promise<void> {

    // In an operational pipeline, execute:
    const response = await fetch(BASE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // 🛡️ Guard: If the backend crashes (500), throw an error immediately!
    if (!response.ok) throw new Error(`🔴  POST Delta Sync Failed with status: ${response.status}`);
  },

  /**
   * 📤 Uploads a raw file binary directly to an S3 bucket destination location
   */
  async uploadImageToS3(file: File): Promise<string> {
    console.log(`☁️ Commencing S3 upload for file: ${file.name}`);
    
    // In production, you typically fetch a pre-signed URL from your backend first:
    const presignRes = await fetch(`${BASE_API_URL}/presign?filename=${file.name}`);
    const { uploadUrl, publicUrl } = await presignRes.json();
    await fetch(uploadUrl, { method: 'PUT', body: file });
    return publicUrl;
  },

  /**
   * 🗑️ Compensating Transaction: Reverses an S3 upload by deleting the asset
   */
  async deleteImageFromS3(s3Url: string): Promise<void> {
    console.warn(`🧹 Executing S3 Rollback Cleanup for asset: ${s3Url}`);
    
    // In production, request your backend to invalidate/delete the S3 asset:
    await fetch(`${BASE_API_URL}/storage/cleanup`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: s3Url })
    });
  }
};