import { authService } from '@/features/auth/api/authService';
import type { SignUpPayload } from '@/features/auth/types/auth.types';
import { useMutation } from '@tanstack/react-query';
// import { authService } from '../api/authService';

export const useSignUp = () => {
  return useMutation({
    mutationFn: (payload: SignUpPayload) => authService.signUp(payload),
  });
};