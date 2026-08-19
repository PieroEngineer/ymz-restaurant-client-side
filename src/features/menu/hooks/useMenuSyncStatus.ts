import { useMemo } from 'react';

import { checkMinimalDiff } from '@/features/menu/helpers/menuComparators';
import type { SyncStatusType } from '@/features/menu/types/support/syncStatus.types';
import type { DishItem, Menu, MenuPage } from '@/features/menu/types/domain.types';

export function useMenuSyncStatus(
  draftPages: MenuPage[],
  draftDishes: DishItem[],
  isUploading: boolean,

  menuSnapshot: Menu,

  isErrorInUpload: boolean,
  isDownloading: boolean,
  isErrorInDownload: boolean,
): SyncStatusType {
  
  return useMemo((): SyncStatusType => {
    if (isDownloading) return 'Downloading';
    if (isUploading) return 'Uploading';
    if (isErrorInUpload || isErrorInDownload) return 'Error';

    return checkMinimalDiff(draftPages, draftDishes, menuSnapshot)
      ? 'Unsynchronized'
      : 'Synchronized';
  }, [draftPages, draftDishes, menuSnapshot, isDownloading, isErrorInDownload, isUploading]);
}
