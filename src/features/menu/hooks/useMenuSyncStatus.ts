import { useMemo } from 'react';

import { checkMinimalDiff } from '@/features/menu/helpers/menuComparators';
import type { SyncStatusType } from '@/features/menu/types/syncStatus.types';
import type { CloudMenuGetPayload, DishItem, MenuPage } from '@/features/menu/types/sync.types';

interface UseMenuSyncStatusParams {
  draftPages: MenuPage[];
  draftDishes: DishItem[];
  dbSnapshot: CloudMenuGetPayload | undefined;
  isLoading: boolean;
  isError: boolean;
  isSyncPending: boolean;
}

export function useMenuSyncStatus({
  draftPages,
  draftDishes,
  dbSnapshot,
  isLoading,
  isError,
  isSyncPending,
}: UseMenuSyncStatusParams): SyncStatusType {
  return useMemo((): SyncStatusType => {
    if (isLoading || isSyncPending) return 'Loading';
    if (isError && !dbSnapshot) return 'Unsynchronized';
    if (!dbSnapshot) return 'Loading';

    return checkMinimalDiff(draftPages, draftDishes, dbSnapshot)
      ? 'Unsynchronized'
      : 'Synchronized';
  }, [draftPages, draftDishes, dbSnapshot, isLoading, isError, isSyncPending]);
}
