import { useCallback, useEffect, useMemo, useState } from 'react';

import { getRestaurantMenu, saveRestaurantMenuDiff } from '@/features/menu/api/menuApi';
import type {
  DishDiffItem,
  MenuPageDiffItem,
  MenuSyncDiff,
  MenuSyncSnapshot,
  MenuSyncSource,
  MenuSyncStatus,
  SyncedDish,
  SyncedMenuPage,
} from '@/features/menu/types/sync.types';

const toPriceCents = (cost: string) => {
  const parsedCost = Number.parseFloat(cost);
  if (Number.isNaN(parsedCost)) return 0;

  return Math.round(parsedCost * 100);
};

const toPrepTime = (prepTime: string) => {
  const parsedPrepTime = Number.parseInt(prepTime, 10);
  if (Number.isNaN(parsedPrepTime)) return 0;

  return parsedPrepTime;
};

const toSyncedSnapshot = ({ menuPages, dishes }: MenuSyncSource): MenuSyncSnapshot => {
  const syncedMenuPages: SyncedMenuPage[] = menuPages.map((page, index) => ({
    pageId: page.pageId,
    pageNumber: index + 1,
    imageUrl: page.imageUrl,
  }));

  const syncedDishes: SyncedDish[] = dishes
    .map((dish) => {
      const menuPage = menuPages[dish.pageIndex];
      if (!menuPage) return null;

      return {
        id: dish.id,
        name: dish.name,
        priceCents: toPriceCents(dish.cost),
        prepTime: toPrepTime(dish.prepTime),
        menuPageId: menuPage.pageId,
        coordinateXInMenu: Math.round(dish.xPercent),
        coordinateYInMenu: Math.round(dish.yPercent),
        description: '',
      };
    })
    .filter((dish): dish is SyncedDish => dish !== null);

  return {
    menuPages: syncedMenuPages,
    dishes: syncedDishes,
  };
};

const areObjectsEqual = <T extends object>(left: T, right: T) => {
  return JSON.stringify(left) === JSON.stringify(right);
};

const buildUpdatedFields = <T extends object>(current: T, previous: T): Partial<T> => {
  return Object.entries(current).reduce<Partial<T>>((updatedFields, [key, value]) => {
    const typedKey = key as keyof T;

    if (previous[typedKey] !== value) {
      updatedFields[typedKey] = value as T[keyof T];
    }

    return updatedFields;
  }, {});
};

const omitKey = <T extends object, K extends keyof T>(source: T, keyToOmit: K): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => key !== keyToOmit)
  ) as Omit<T, K>;
};

const buildMenuPageDiff = (
  currentPages: SyncedMenuPage[],
  previousPages: SyncedMenuPage[]
): MenuPageDiffItem[] => {
  const previousById = new Map(previousPages.map((page) => [page.pageId, page]));
  const currentById = new Map(currentPages.map((page) => [page.pageId, page]));

  const savedOrUpdatedPages = currentPages.flatMap<MenuPageDiffItem>((page) => {
    const previousPage = previousById.get(page.pageId);

    if (!previousPage) {
      return [{ ...page, action: 'save' }];
    }

    if (areObjectsEqual(page, previousPage)) return [];

    const currentComparableFields = omitKey(page, 'pageId');
    const previousComparableFields = omitKey(previousPage, 'pageId');

    return [
      {
        id: page.pageId,
        action: 'update',
        updatedFields: buildUpdatedFields(currentComparableFields, previousComparableFields),
      },
    ];
  });

  const deletedPages = previousPages
    .filter((page) => !currentById.has(page.pageId))
    .map<MenuPageDiffItem>((page) => ({
      pageId: page.pageId,
      action: 'delete',
    }));

  return [...savedOrUpdatedPages, ...deletedPages];
};

const buildDishDiff = (currentDishes: SyncedDish[], previousDishes: SyncedDish[]): DishDiffItem[] => {
  const previousById = new Map(previousDishes.map((dish) => [dish.id, dish]));
  const currentById = new Map(currentDishes.map((dish) => [dish.id, dish]));

  const savedOrUpdatedDishes = currentDishes.flatMap<DishDiffItem>((dish) => {
    const previousDish = previousById.get(dish.id);

    if (!previousDish) {
      return [{ ...dish, action: 'save' }];
    }

    if (areObjectsEqual(dish, previousDish)) return [];

    const currentComparableFields = omitKey(dish, 'id');
    const previousComparableFields = omitKey(previousDish, 'id');

    return [
      {
        id: dish.id,
        action: 'update',
        updatedFields: buildUpdatedFields(currentComparableFields, previousComparableFields),
      },
    ];
  });

  const deletedDishes = previousDishes
    .filter((dish) => !currentById.has(dish.id))
    .map<DishDiffItem>((dish) => ({
      id: dish.id,
      action: 'delete',
    }));

  return [...savedOrUpdatedDishes, ...deletedDishes];
};

const buildMenuSyncDiff = (
  currentSnapshot: MenuSyncSnapshot,
  previousSnapshot: MenuSyncSnapshot
): MenuSyncDiff => {
  return {
    menuPages: buildMenuPageDiff(currentSnapshot.menuPages, previousSnapshot.menuPages),
    dishes: buildDishDiff(currentSnapshot.dishes, previousSnapshot.dishes),
  };
};

const emptySnapshot: MenuSyncSnapshot = {
  menuPages: [],
  dishes: [],
};

interface UseMenuSyncParams {
  restaurantId: string;
  source: MenuSyncSource;
}

export function useMenuSync({ restaurantId, source }: UseMenuSyncParams) {
  const [lastSyncedSnapshot, setLastSyncedSnapshot] = useState<MenuSyncSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentSnapshot = useMemo(() => toSyncedSnapshot(source), [source]);
  const baseSnapshot = lastSyncedSnapshot ?? emptySnapshot;
  const pendingDiff = useMemo(
    () => buildMenuSyncDiff(currentSnapshot, baseSnapshot),
    [baseSnapshot, currentSnapshot]
  );

  const hasPendingChanges = pendingDiff.menuPages.length > 0 || pendingDiff.dishes.length > 0;
  const status: MenuSyncStatus = isLoading
    ? 'loading'
    : hasPendingChanges
      ? 'unsynchronized'
      : 'synchronized';

  useEffect(() => {
    let isActive = true;

    async function loadLastSyncedSnapshot() {
      if (!restaurantId) return;

      setIsLoading(true);

      try {
        const cloudSnapshot = await getRestaurantMenu(restaurantId);
        if (isActive) setLastSyncedSnapshot(cloudSnapshot);
      } catch (error) {
        console.error('Menu sync snapshot load failed:', error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadLastSyncedSnapshot();

    return () => {
      isActive = false;
    };
  }, [restaurantId]);

  const synchronizeMenu = useCallback(async () => {
    if (!restaurantId || isLoading || !hasPendingChanges) return;

    setIsLoading(true);

    try {
      const cloudSnapshot = await saveRestaurantMenuDiff(restaurantId, pendingDiff);
      setLastSyncedSnapshot(cloudSnapshot ?? currentSnapshot);
    } finally {
      setIsLoading(false);
    }
  }, [currentSnapshot, hasPendingChanges, isLoading, pendingDiff, restaurantId]);

  return {
    status,
    pendingDiff,
    synchronizeMenu,
    canSynchronize: status === 'unsynchronized',
  };
}
