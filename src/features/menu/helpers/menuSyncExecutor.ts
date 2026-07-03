import { menuApi } from '@/features/menu/api/menuApi';
import { buildSyncedSnapshot } from '@/features/menu/helpers/menuMappers';
import { generateDiffPayload } from '@/features/menu/helpers/menuComparators';
import type {
  CloudMenuGetPayload,
  DishItem,
  MenuPage,
} from '@/features/menu/types/sync.types';

export interface MenuSyncVariables {
  currentPages: MenuPage[];
  currentDishes: DishItem[];
  localPageFilesMap: Record<string, File>;
  dbSnapshot: CloudMenuGetPayload;
}

export interface MenuSyncResult {
  nextSnapshot: CloudMenuGetPayload;
  finalSnapshotPages: MenuPage[];
}

export async function executeMenuSync({
  currentPages,
  currentDishes,
  localPageFilesMap,
  dbSnapshot,
}: MenuSyncVariables): Promise<MenuSyncResult> {
  const diffPayload = generateDiffPayload(currentPages, currentDishes, dbSnapshot);

  let syncResponseData: Awaited<ReturnType<typeof menuApi.pushMenuDeltaChanges>> | null = null;

  try {
    syncResponseData = await menuApi.pushMenuDeltaChanges(diffPayload);

    if (syncResponseData.presignedUrls && syncResponseData.presignedUrls.length > 0) {
      await Promise.all(
        syncResponseData.presignedUrls.map(async (mapping) => {
          const fileToUpload = localPageFilesMap[mapping.pageId];
          if (!fileToUpload) return;

          try {
            await menuApi.uploadImageToS3(
              mapping.uploadUrl.replaceAll('172.18.0.2', 'localhost'),
              fileToUpload,
            );
          } catch (s3UploadError) {
            throw new Error(
              `S3_UPLOAD_FAILURE|${mapping.pageId}|${s3UploadError instanceof Error ? s3UploadError.message : ''}`,
            );
          }
        }),
      );

      console.log('✅🖼️  All images where successfully processed');
    }

    const { nextSnapshot, finalSnapshotPages } = buildSyncedSnapshot(
      currentPages,
      currentDishes,
      syncResponseData.presignedUrls ?? [],
    );

    console.log('🔎  New Snapshot', nextSnapshot);
    console.log('🔎  Page data now', currentPages);
    console.log('🔎  Dishe data now', currentDishes);

    return { nextSnapshot, finalSnapshotPages };
  } catch (err) {
    console.error('🔴  Critical database upload synchronization failure:', err);

    const errorMessage = err instanceof Error ? err.message : '';

    if (syncResponseData !== null && errorMessage.startsWith('S3_UPLOAD_FAILURE')) {
      console.warn('⚠️ Metadata saved but binary upload failed. Possible ghost items in backend...');
    }

    throw err;
  }
}
