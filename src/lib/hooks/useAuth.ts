import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthActions, useAuth } from '../../app/store/userSlice';
import { 
  loginAndGetUser, 
  registerUser, 
  registerUserWithDealer, 
  getCurrentUser, 
  logoutUser 
} from '../api/authApi';
import { apiClient } from '../api/client';

// Login hook
export const useLogin = () => {
  const { setAuth, setLoading } = useAuthActions();
  const router = useRouter();

  return useMutation({
    mutationFn: loginAndGetUser,
    onMutate: () => {
      console.log('Login started...');
      setLoading(true);
    },
    onSuccess: ({ user, token }) => {
      console.log('Login successful:', { user, token });
      
      // Store auth data in Zustand store
      setAuth(user, token);
      
      // Set token in API client for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;
      
      // Store token in localStorage as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token.access_token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }
      
      // Redirect to dashboard or home
      router.push('/');
    },
    onError: (error) => {
      setLoading(false);
      console.error('Login failed:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// Register hook
export const useRegister = () => {
  const { setAuth, setLoading } = useAuthActions();
  const router = useRouter();

  return useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (user) => {
      // For registration, we'll need to login separately to get the token
      // Or you could auto-login after registration
      setLoading(false);
      
      // Redirect to login page with success message
      router.push('/login?registered=true');
    },
    onError: (error) => {
      setLoading(false);
      console.error('Registration failed:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// Register with dealer profile hook
export const useRegisterWithDealer = () => {
  const { setAuth, setLoading } = useAuthActions();
  const router = useRouter();

  return useMutation({
    mutationFn: registerUserWithDealer,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (user) => {
      setLoading(false);
      
      // Redirect to login page with success message
      router.push('/login?registered=true&dealer=true');
    },
    onError: (error) => {
      setLoading(false);
      console.error('Dealer registration failed:', error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// Logout hook
export const useLogout = () => {
  const { clearAuth } = useAuthActions();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // Call logout function to clear tokens
      logoutUser();
    },
    onSuccess: () => {
      // Clear auth state in store
      clearAuth();
      
      // Redirect to home or login page
      router.push('/');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      clearAuth();
      router.push('/');
    },
  });
};

// Get current user hook (for refreshing user data)
export const useCurrentUser = () => {
  const { token } = useAuth();
  const { setUser } = useAuthActions();

  const query = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    enabled: !!token, // Only run if we have a token
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle success/error in useEffect-like pattern
  if (query.data && query.isSuccess) {
    setUser(query.data);
  }

  if (query.error) {
    console.error('Failed to fetch current user:', query.error);
    // If unauthorized, might need to logout
    if (query.error instanceof Error && query.error.message.includes('401')) {
      logoutUser();
    }
  }

  return query;
};

// Initialize auth on app start
export const useInitializeAuth = () => {
  const { isAuthenticated } = useAuth();
  const { setAuth, clearAuth } = useAuthActions();

  return useQuery({
    queryKey: ['initializeAuth'],
    queryFn: async () => {
      // Check if we have stored auth data
      if (typeof window === 'undefined') return null;
      
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user_data');
      
      if (!storedToken) {
        clearAuth();
        return null;
      }

      try {
        // Set token in API client
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Try to verify token is still valid by fetching current user
        try {
          const user = await getCurrentUser();
          
          // If successful, restore auth state
          const tokenObj = { access_token: storedToken, token_type: 'bearer' };
          setAuth(user, tokenObj);
          
          return { user, token: tokenObj };
        } catch (userError) {
          console.warn('Failed to fetch user details during initialization, using stored data:', userError);
          
          // If /me fails but we have stored user data, try to use it
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              const tokenObj = { access_token: storedToken, token_type: 'bearer' };
              setAuth(user, tokenObj);
              
              return { user, token: tokenObj };
            } catch (parseError) {
              console.error('Failed to parse stored user data:', parseError);
              throw parseError;
            }
          } else {
            // No stored user data and /me fails, clear everything
            throw userError;
          }
        }
      } catch {
        // Token is invalid or other error, clear everything
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        delete apiClient.defaults.headers.common['Authorization'];
        clearAuth();
        return null;
      }
    },
    enabled: !isAuthenticated, // Only run if not already authenticated
    retry: false,
    staleTime: Infinity, // Don't refetch unless specifically requested
  });
};

// Hook for protecting routes
export const useAuthGuard = (redirectTo: string = '/login') => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Don't automatically initialize auth here to prevent double calls
  // The app should handle initialization at the root level

  // Redirect if not authenticated and not loading
  if (!isLoading && !isAuthenticated) {
    router.push(redirectTo);
  }

  return { isAuthenticated, isLoading };
};
