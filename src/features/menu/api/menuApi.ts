import type { CloudMenuGetPayload, CloudMenuDiffPayload } from '@/features/menu/types/sync.types';

// 🧪 Testing Parameters Configuration Placeholders
const TEMP_RESTAURANT_ID = '4258e0fa-6b3c-43bc-a6d8-82c5835d608d';
const BASE_API_URL = `http://localhost:4566/_aws/execute-api/evaoj7jrmc/prod/restaurants/${TEMP_RESTAURANT_ID}/menu`;

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
  async pushMenuDeltaChanges(payload: CloudMenuDiffPayload): Promise<SyncDataFirstResponse> {

    // In an operational pipeline, execute:
    const response = await fetch(`${BASE_API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // 🛡️ Guard: If the backend crashes (500), throw an error immediately!
    if (!response.ok) throw new Error(`🔴  POST Delta Sync Failed with status: ${response.status}`);
  
    return response.json();
  },

   /**
   * ☁️ HOP 2: Upload direct file binary to S3 using the newly generated pre-signed token URL
   */
  async uploadImageToS3(presignedUploadUrl: string, file: File): Promise<void> {
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

  //X
  // /**
  //  * 🚨 HOP 3 (Optional Rollback): Purges ghost metadata rows out of DynamoDB if assets fail to attach
  //  */
  // async rollbackGhostDatabaseRecords(payload: CloudMenuDiffPayload): Promise<void> {
  //   console.warn('🧹 Initiating client-side compensating transaction: rolling back DynamoDB ghost frames...');
    
  //   const response = await fetch(`${BASE_API_URL}/rollback-ghost-data`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload)
  //   });

  //   if (!response.ok) {
  //     console.error(`🚨 Critical: Server rejected the transaction rollback request: ${response.status}`);
  //   }
  // }
};