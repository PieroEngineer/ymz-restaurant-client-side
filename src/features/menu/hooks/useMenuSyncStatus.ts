import { useMemo } from 'react';

import { checkMinimalDiff } from '@/features/menu/helpers/menuComparators';
import type { SyncStatusType } from '@/features/menu/types/support/syncStatus.types';
import type { DishItem, Menu, MenuPage } from '@/features/menu/types/domain.types';

export function useMenuSyncStatus(
  draftPages: MenuPage[],
  draftDishes: DishItem[],
  isSyncPending: boolean,

  dbSnapshot: Menu | undefined,

  isLoading: boolean,
  isError: boolean,
): SyncStatusType {
  
  return useMemo((): SyncStatusType => {
    if (isLoading || isSyncPending) return 'Loading';
    if (isError && !dbSnapshot) return 'Unsynchronized';
    if (!dbSnapshot) return 'Loading';

    return checkMinimalDiff(draftPages, draftDishes, dbSnapshot)
      ? 'Unsynchronized'
      : 'Synchronized';
  }, [draftPages, draftDishes, dbSnapshot, isLoading, isError, isSyncPending]);
}
