import { MOCK_MENU_RESTAURANT_ID } from '@/features/menu/api/menuApi';

export const menuQueryKeys = {
  all: ['menu'] as const,
  datasets: () => [...menuQueryKeys.all, 'dataset'] as const,
  dataset: () => [...menuQueryKeys.datasets(), MOCK_MENU_RESTAURANT_ID] as const,
};
