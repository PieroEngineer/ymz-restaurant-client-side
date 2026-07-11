import { useQuery } from '@tanstack/react-query';

import { menuApi } from '@/features/menu/api/menuApi';
import { menuQueryKeys } from '@/features/menu/api/menuQueryKeys';

export function deprecateUseMenuDatasetQuery() {
  return useQuery({
    queryKey: menuQueryKeys.dataset(),
    queryFn: menuApi.deprecateFetchMenuDataset,
  });
}

export function UseMenuDatasetQuery() {
  return useQuery({
    queryKey: menuQueryKeys.dataset(),
    queryFn: menuApi.FetchMenuDataset
  });
}
