import { useCallback, useEffect, useRef } from 'react';

import { checkMinimalDiff } from '@/features/menu/helpers/menuComparators';
import { mapCloudPayloadToMenuState } from '@/features/menu/helpers/handleRemoteUrls';
import { deprecateUseMenuDatasetQuery } from '@/features/menu/hooks/useMenuDatasetQuery';
import { useMenuSyncMutation } from '@/features/menu/hooks/useMenuDraft';
import { useMenuSyncStatus } from '@/features/menu/hooks/useMenuSyncStatus';
import type { deprecateDish, MenuPage } from '@/features/menu/types/domain.types';

/**
 * @deprecated Use `useMenuEditor` instead. This hook required passing draft state
 * and callbacks from the page, splitting ownership between the hook and its caller.
 */
export function deprecateUseMenuCloudSync(
  currentPages: MenuPage[],
  currentDishes: deprecateDish[],
  localPageFilesMap: Record<string, File>,
  onInitializeData: (pages: MenuPage[], dishes: deprecateDish[]) => void,
  onImportedImageWithRemoteUrlsNeeded: (updatedPages: MenuPage[]) => void,
) {
  const { data: dbSnapshot, isLoading, isError } = deprecateUseMenuDatasetQuery();
  const syncMutation = useMenuSyncMutation();

  const hasInitializedRef = useRef(false);
  const onInitializeDataRef = useRef(onInitializeData);
  const onImportedImageRef = useRef(onImportedImageWithRemoteUrlsNeeded);

  onInitializeDataRef.current = onInitializeData;
  onImportedImageRef.current = onImportedImageWithRemoteUrlsNeeded;

  useEffect(() => {
    if (!dbSnapshot || hasInitializedRef.current) return;

    hasInitializedRef.current = true;

    const { pages, dishes } = mapCloudPayloadToMenuState(dbSnapshot);
    onInitializeDataRef.current(pages, dishes);
  }, [dbSnapshot]);

  const syncStatus = useMenuSyncStatus({
    draftPages: currentPages,
    draftDishes: currentDishes,
    dbSnapshot,
    isLoading,
    isError,
    isSyncPending: syncMutation.isPending,
  });

  const synchronizeDatasetChanges = useCallback(() => {
    if (!dbSnapshot) return;
    if (!checkMinimalDiff(currentPages, currentDishes, dbSnapshot)) return;

    syncMutation.mutate(
      {
        currentPages,
        currentDishes,
        localPageFilesMap,
        dbSnapshot,
      },
      {
        onSuccess: ({ finalSnapshotPages }) => {
          onImportedImageRef.current(finalSnapshotPages);
        },
      },
    );
  }, [dbSnapshot, currentPages, currentDishes, localPageFilesMap, syncMutation]);

  return { syncStatus, synchronizeDatasetChanges };
}
