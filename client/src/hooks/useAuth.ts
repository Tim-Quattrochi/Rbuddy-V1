import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { queryClient, getQueryFn, apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
  email: string;
  googleId?: string;
  avatarUrl?: string;
  phoneNumber?: string;
}

interface UserResponse {
  user: User;
}

/**
 * Global authentication hook using TanStack Query as the single source of truth.
 * Fetches current user from /api/users/me on mount.
 */
export function useAuth() {
  const navigate = useNavigate();
  
  // Fetch current user - returns null on 401 (not authenticated)
  const { data, isLoading, error, refetch } = useQuery<UserResponse | null>({
    queryKey: ['/api/users/me'],
    queryFn: getQueryFn<UserResponse | null>({ on401: 'returnNull' }),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const user = data?.user ?? null;
  const isAuthenticated = !!user;

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/auth/logout');
    },
    onSuccess: () => {
      // Clear all query cache to reset application state
      queryClient.clear();
      // Redirect to login page
      navigate('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Still redirect to login even if logout fails
      queryClient.clear();
      navigate('/login');
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
    isLoggingOut: logoutMutation.isPending,
    refetch,
  };
}
