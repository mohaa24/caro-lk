import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRead, Token } from '../types/auth';

interface UserState {
  // User data
  user: UserRead | null;
  token: Token | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: UserRead) => void;
  setToken: (token: Token) => void;
  setAuth: (user: UserRead, token: Token) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  
  // Computed
  isDealer: () => boolean;
  getFullName: () => string;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user: UserRead) => {
        set({ 
          user, 
          isAuthenticated: true 
        });
      },

      setToken: (token: Token) => {
        set({ token });
      },

      setAuth: (user: UserRead, token: Token) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false 
        });
      },

      clearAuth: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Computed values
      isDealer: () => {
        const state = get();
        return state.user?.user_type === 'Dealership';
      },

      getFullName: () => {
        const state = get();
        if (!state.user) return '';
        
        const { first_name, last_name, business_name, user_type } = state.user;
        
        // For dealers, prefer business name
        if (user_type === 'Dealership' && business_name) {
          return business_name;
        }
        
        // For individuals or dealers without business name
        const parts = [first_name, last_name].filter(Boolean);
        return parts.length > 0 ? parts.join(' ') : state.user.email;
      },
    }),
    {
      name: 'user-store', // localStorage key
      // Only persist essential data
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for common use cases
export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading } = useUserStore();
  return { user, token, isAuthenticated, isLoading };
};

export const useAuthActions = () => {
  const { setUser, setToken, setAuth, clearAuth, setLoading } = useUserStore();
  return { setUser, setToken, setAuth, clearAuth, setLoading };
};

export const useUserInfo = () => {
  const { user, isDealer, getFullName } = useUserStore();
  return { 
    user, 
    isDealer: isDealer(), 
    fullName: getFullName(),
    email: user?.email,
    userType: user?.user_type,
  };
};
