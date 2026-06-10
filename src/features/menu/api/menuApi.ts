import { api } from '@/shared/api/axiosClient';
import type { MenuSyncDiff, MenuSyncSnapshot } from '@/features/menu/types/sync.types';

const MENU_ENDPOINT_PLACEHOLDER = 'http://localhost:4566/_aws/execute-api/tc0w8bxqdb/prod/restaurants';

const getRestaurantMenuUrl = (restaurantId: string) => {
  return `${MENU_ENDPOINT_PLACEHOLDER}/${restaurantId}/menu`;
};

export async function getRestaurantMenu(restaurantId: string): Promise<MenuSyncSnapshot> {
  const response = await api.get<MenuSyncSnapshot>(getRestaurantMenuUrl(restaurantId));
  return response.data;
}

export async function saveRestaurantMenuDiff(
  restaurantId: string,
  diff: MenuSyncDiff
): Promise<MenuSyncSnapshot> {
  const response = await api.post<MenuSyncSnapshot>(getRestaurantMenuUrl(restaurantId), diff);
  return response.data;
}
