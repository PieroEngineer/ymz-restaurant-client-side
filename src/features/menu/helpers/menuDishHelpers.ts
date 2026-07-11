import type { DishItem, MenuPage } from '@/features/menu/types/domain.types';

export function areDishCollectionsEqual(left: DishItem[], right: DishItem[]): boolean {
  if (left.length !== right.length) return false;

  return left.every((leftDish, index) => {
    const rightDish = right[index];

    return (
      leftDish.id === rightDish.id &&
      leftDish.name === rightDish.name &&
      leftDish.priceCents === rightDish.priceCents &&
      leftDish.prepTime === rightDish.prepTime &&
      leftDish.parentPageId === rightDish.parentPageId &&
      leftDish.coordinateXInMenu === rightDish.coordinateXInMenu &&
      leftDish.coordinateYInMenu === rightDish.coordinateYInMenu &&
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
      const pageA = menuPages.find((page) => page.pageId === a.parentPageId)?.pageNumber ?? 0;
      const pageB = menuPages.find((page) => page.pageId === b.parentPageId)?.pageNumber ?? 0;
      if (pageA !== pageB) return pageA - pageB;
      if (a.coordinateYInMenu !== b.coordinateYInMenu) return a.coordinateYInMenu - b.coordinateYInMenu;
      return a.createdAt - b.createdAt;
    })
    .map((dish, index) => ({
      ...dish,
      orderNumber: index + 1,
    }));
}
