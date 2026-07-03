import { useQuery } from '@tanstack/react-query';

import { menuApi } from '@/features/menu/api/menuApi';
import { menuQueryKeys } from '@/features/menu/api/menuQueryKeys';

export function useMenuDatasetQuery() {
  return useQuery({
    queryKey: menuQueryKeys.dataset(),
    queryFn: menuApi.fetchMenuDataset,
  });
}
