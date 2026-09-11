import { authService } from '@/features/auth/api/authService';
import { NavigationPaths } from '@/shared/constants/navigation-names';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

export const useAuthUser = () => {
  const navigate = useNavigate(); // TanStack navigation hook instance
  const queryClient = useQueryClient();

  const getUserQuery = useQuery({
    queryKey: ['authUser'],
    queryFn: authService.getCurrentUserProfile,
    staleTime: 1000 * 60 * 15, // Cache session locally for 15 minutes
    retry: false,
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      console.log("🔎  Signing out user...")
      await authService.signOut()
      
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onSuccess: () => {

      console.log("🔎  Signed out user successfully.")
      navigate({to: NavigationPaths.Auth})
    }
  })

  return {
    data: getUserQuery.data,
    signOut: () => signOutMutation.mutate()
  }
};