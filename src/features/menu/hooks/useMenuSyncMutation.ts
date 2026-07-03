import { useMutation, useQueryClient } from '@tanstack/react-query';

import { menuQueryKeys } from '@/features/menu/api/menuQueryKeys';
import {
  executeMenuSync,
  type MenuSyncVariables,
} from '@/features/menu/helpers/menuSyncExecutor';

export function useMenuSyncMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: MenuSyncVariables) => executeMenuSync(variables),
    onSuccess: (result) => {
      queryClient.setQueryData(menuQueryKeys.dataset(), result.nextSnapshot);
    },
  });
}
