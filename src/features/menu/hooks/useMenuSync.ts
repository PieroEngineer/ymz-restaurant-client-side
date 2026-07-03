import { useMenuCloudSync } from '@/features/menu/hooks/useMenuCloudSync';
import type { DishItem, MenuPage } from '@/features/menu/types/sync.types';

export type { SyncStatusType } from '@/features/menu/types/syncStatus.types';

/**
 * @deprecated Use `useMenuEditor` instead.
 */
export function useMenuSync(
  currentPages: MenuPage[],
  currentDishes: DishItem[],
  localPageFilesMap: Record<string, File>,
  onInitializeData: (pages: MenuPage[], dishes: DishItem[]) => void,
  onImportedImageWithRemoteUrlsNeeded: (updatedPages: MenuPage[]) => void,
) {
  return useMenuCloudSync(
    currentPages,
    currentDishes,
    localPageFilesMap,
    onInitializeData,
    onImportedImageWithRemoteUrlsNeeded,
  );
}
