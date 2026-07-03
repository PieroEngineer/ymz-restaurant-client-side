import type { DishItem, MenuPage } from '@/features/menu/types/sync.types';

export function areDishCollectionsEqual(left: DishItem[], right: DishItem[]): boolean {
  if (left.length !== right.length) return false;

  return left.every((leftDish, index) => {
    const rightDish = right[index];

    return (
      leftDish.id === rightDish.id &&
      leftDish.pageId === rightDish.pageId &&
      leftDish.coordinateXInMenu === rightDish.coordinateXInMenu &&
      leftDish.coordinateYInMenu === rightDish.coordinateYInMenu &&
      leftDish.name === rightDish.name &&
      leftDish.cost === rightDish.cost &&
      leftDish.prepTime === rightDish.prepTime &&
      leftDish.createdAt === rightDish.createdAt
    );
  });
}

export function sortDishesWithOrderNumbers(
  dishes: DishItem[],
  menuPages: MenuPage[],
): (DishItem & { orderNumber: number })[] {
  return [...dishes]
    .sort((a, b) => {
      const pageA = menuPages.find((page) => page.pageId === a.pageId)?.pageNumber ?? 0;
      const pageB = menuPages.find((page) => page.pageId === b.pageId)?.pageNumber ?? 0;
      if (pageA !== pageB) return pageA - pageB;
      if (a.coordinateYInMenu !== b.coordinateYInMenu) return a.coordinateYInMenu - b.coordinateYInMenu;
      return a.createdAt - b.createdAt;
    })
    .map((dish, index) => ({
      ...dish,
      orderNumber: index + 1,
    }));
}
