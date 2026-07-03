import type { PresignedUrlMapping } from '@/features/menu/api/menuApi';
import type {
  CloudMenuGetPayload,
  DishItem,
  MenuPage,
} from '@/features/menu/types/sync.types';

export function mapCloudPayloadToMenuState(data: CloudMenuGetPayload): {
  pages: MenuPage[];
  dishes: DishItem[];
} {
  const pages: MenuPage[] = data.menuPages.map((page) => ({
    pageId: page.pageId,
    imageUrl: page.imageUrl,
    pageNumber: page.pageNumber,
  }));

  const dishes: DishItem[] = data.dishes.map((dish) => ({
    id: dish.id,
    pageId: dish.menuPageId,
    imageUrl: dish.imageUrl,
    coordinateXInMenu: dish.coordinateXInMenu,
    coordinateYInMenu: dish.coordinateYInMenu,
    name: dish.name,
    cost: (dish.priceCents / 100).toFixed(2),
    prepTime: dish.prepTime.toString(),
    createdAt: Date.now(),
  }));

  return { pages, dishes };
}

export function buildSyncedSnapshot(
  currentPages: MenuPage[],
  currentDishes: DishItem[],
  presignedUrls: PresignedUrlMapping[],
): { nextSnapshot: CloudMenuGetPayload; finalSnapshotPages: MenuPage[] } {
  const finalSnapshotPages = currentPages.map((page) => {
    const tokenMatch = presignedUrls.find((mapping) => mapping.pageId === page.pageId);

    return {
      pageId: page.pageId,
      imageUrl: tokenMatch ? tokenMatch.publicUrl : page.imageUrl,
      pageNumber: page.pageNumber,
    };
  });

  const nextSnapshot: CloudMenuGetPayload = {
    menuPages: finalSnapshotPages.map((page) => ({
      pageId: page.pageId,
      imageUrl: page.imageUrl,
      pageNumber: page.pageNumber,
    })),
    dishes: currentDishes.map((dish) => ({
      id: dish.id,
      name: dish.name,
      imageUrl: '',
      priceCents: Math.round(parseFloat(dish.cost || '0') * 100),
      prepTime: parseInt(dish.prepTime || '0', 10),
      isOutOfStock: true,
      menuPageId: dish.pageId,
      coordinateXInMenu: dish.coordinateXInMenu,
      coordinateYInMenu: dish.coordinateYInMenu,
      description: '',
    })),
  };

  return { nextSnapshot, finalSnapshotPages };
}
