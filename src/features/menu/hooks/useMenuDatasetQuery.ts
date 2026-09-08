import { useQuery } from '@tanstack/react-query';

import { menuApi } from '@/features/menu/api/menuApi';
import type { MenuQueryKey } from '@/features/menu/types/query.types';

export function UseMenuDatasetQuery(restaurantId: string | undefined) {

  const menuQueryKey: MenuQueryKey = ['menu', 'dataset', { restaurantId }]

  return useQuery({
    queryKey: menuQueryKey,
    queryFn: menuApi.FetchMenuDataset,
    enabled: !!restaurantId
  });
}
