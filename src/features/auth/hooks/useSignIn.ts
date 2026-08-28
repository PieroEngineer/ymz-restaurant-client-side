import { authService } from '@/features/auth/api/authService';
import type { SignInPayload } from '@/features/auth/types/auth.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { authService } from '../api/authService';

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SignInPayload) => authService.signIn(payload),
    onSuccess: () => {
      // Refresh user profile query state immediately after login
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });
};