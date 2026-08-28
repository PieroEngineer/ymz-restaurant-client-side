import { authService } from '@/features/auth/api/authService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { authService } from '../api/authService';

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // Clear user state and reset query cache
      queryClient.setQueryData(['authUser'], null);
      queryClient.clear();
    },
  });
};