import { authService } from '@/features/auth/api/authService';
import { useQuery } from '@tanstack/react-query';

export const useAuthUser = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: () => authService.getCurrentUserProfile(),
    staleTime: 1000 * 60 * 15, // Cache session locally for 15 minutes
    retry: false,
  });
};