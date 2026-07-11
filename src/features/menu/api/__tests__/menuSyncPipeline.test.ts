import { describe, it, expect } from 'vitest';
import { menuApi } from '@/features/menu/api/menuApi';
import { type CloudMenuDiffPayload } from '@/features/menu/types/domain.types';

describe('Menu Synchronization Multi-Hop Integration Suite (LocalStack)', () => {
  
  /**
   * 🛠️ Helper function to generate a real binary .webp file out of thin air
   * entirely in memory without hitting the hard drive.
   */
  const createInMemoryWebpFile = (): File => {
    // A tiny, valid transparent 1x1 pixel webp file represented as a base64 string
    const base64Webp = 'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuBAAAA';
    
    // Convert the string base64 back into raw binary text data
    const binaryString = atob(base64Webp);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Package the raw byte array into a real browser File instance
    return new File([bytes.buffer], 'test-menu-page.webp', { type: 'image/webp' });
  };

  it('🔄 should successfully execute the entire Data-First + S3 Upload pipeline', async () => {
    
    // ==========================================
    // STEP 0: GENERATE THE BINARY ASSET IN MEMORY
    // ==========================================
    // 🧠 Look, ma! No fs or path imports required!
    const realWebpFile = createInMemoryWebpFile();

    // Generate a fresh random UUID to simulate a new page creation event in the UI
    const mockNewPageId = crypto.randomUUID();

    // ==========================================
    // HOP 1: SEND STRUCTURAL DIFF TO BACKEND
    // ==========================================
    const mockDiffPayload: CloudMenuDiffPayload = {
      menuPages: [
        {
          pageId: mockNewPageId,
          action: 'save',
          pageNumber: 1,
          imageUrl: 'temporary-blob-preview-string'
        }
      ],
      dishes: [] 
    };

    console.log('📡 [Hop 1]: Pushing structural layout changes to backend handler...');
    
    const syncResponse = await menuApi.pushMenuDeltaChanges(mockDiffPayload);

    expect(syncResponse).toBeDefined();
    expect(syncResponse.presignedUrls.length).toBe(1);
    
    const tokenMapping = syncResponse.presignedUrls[0];
    expect(tokenMapping.pageId).toBe(mockNewPageId);
    // expect(tokenMapping.uploadUrl).toContain('localhost:4566'); 

    console.log('🔎  Token received', tokenMapping);
    
    console.log('🟢 [Hop 1 Success]: Received valid Pre-signed URL token from backend.');

    // ==========================================
    // HOP 2: UPLOAD BINARY FILE VIA RECEIVED URL
    // ==========================================
    console.log('☁️ [Hop 2]: Streaming binary .webp file directly to S3 bucket destination...');
    
    await expect(
      menuApi.uploadImageToS3(tokenMapping.uploadUrl, realWebpFile)
    ).resolves.not.toThrow();

    console.log('🟢 [Hop 2 Success]: Binary upload complete.');

    // ==========================================
    // VERIFICATION: PROVE DATA RESTS SAFELY IN S3
    // ==========================================
    const s3Verification = await fetch(tokenMapping.publicUrl, { method: 'GET' });
    expect(s3Verification.status).toBe(200);
    expect(s3Verification.headers.get('content-type')).toBe('image/webp');

    console.log('🏆 [Pipeline Verified]: Metadata is bound and asset file is live on LocalStack!');
  });
});