import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type { 
  UserLogin, 
  UserCreate, 
  UserCreateWithDealer, 
  UserRead, 
  Token, 
  AuthResponse,
  ApiError 
} from '../types/auth';

// Login user and get token
export const loginUser = async (credentials: UserLogin): Promise<Token> => {
  try {
    const response = await apiClient.post<Token>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.detail || 'Login failed');
  }
};

// Register user (simple registration)
export const registerUser = async (userData: UserCreate): Promise<UserRead> => {
  try {
    const response = await apiClient.post<UserRead>(API_ENDPOINTS.AUTH.REGISTER_SIMPLE, userData);
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.response?.status === 422) {
      const details = error.response.data?.detail;
      if (Array.isArray(details)) {
        const errorMessages = details.map((err: any) => err.msg).join(', ');
        throw new Error(errorMessages);
      }
    }
    
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
};

// Register user with dealer profile
export const registerUserWithDealer = async (userData: UserCreateWithDealer): Promise<UserRead> => {
  try {
    const response = await apiClient.post<UserRead>(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  } catch (error: any) {
    console.error('Registration with dealer error:', error);
    
    // Handle validation errors
    if (error.response?.status === 422) {
      const details = error.response.data?.detail;
      if (Array.isArray(details)) {
        const errorMessages = details.map((err: any) => err.msg).join(', ');
        throw new Error(errorMessages);
      }
    }
    
    throw new Error(error.response?.data?.detail || 'Registration failed');
  }
};

// Get current user info
export const getCurrentUser = async (): Promise<UserRead> => {
  try {
    const response = await apiClient.get<UserRead>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  } catch (error: any) {
    console.error('Get current user error:', error);
    throw new Error(error.response?.data?.detail || 'Failed to get user information');
  }
};

// OAuth2 token login (for OpenAPI docs)
export const loginForToken = async (username: string, password: string): Promise<Token> => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const response = await apiClient.post<Token>(
      API_ENDPOINTS.AUTH.TOKEN, 
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Token login error:', error);
    throw new Error(error.response?.data?.detail || 'Token login failed');
  }
};

// Combined login function that returns both user and token
export const loginAndGetUser = async (credentials: UserLogin): Promise<AuthResponse> => {
  console.log('loginAndGetUser called with:', credentials.email);
  
  try {
    // First, login to get the token
    console.log('Calling loginUser...');
    const token = await loginUser(credentials);
    console.log('Login successful, got token:', token);
    
    // Set the token in the API client
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;
    console.log('Token set in API client');
    
    try {
      // Try to get user information
      console.log('Calling getCurrentUser...');
      const user = await getCurrentUser();
      console.log('Got user information:', user);
      return { user, token };
    } catch (userError) {
      console.warn('Failed to fetch user details after login, using token only:', userError);
      
      // If /me fails, create a minimal user object from the token
      // In a real app, you might decode the JWT to get user info
      const fallbackUser: UserRead = {
        id: 0, // We don't have the real ID
        email: credentials.email,
        first_name: null,
        last_name: null,
        user_type: 'Individual',
        business_name: null,
        is_active: true,
        is_superuser: false,
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      console.log('Using fallback user:', fallbackUser);
      return { user: fallbackUser, token };
    }
  } catch (error) {
    console.error('Login process failed:', error);
    // Clear any token that might have been set
    delete apiClient.defaults.headers.common['Authorization'];
    throw error;
  }
};

// Logout function (clears token)
export const logoutUser = (): void => {
  // Clear token from API client
  delete apiClient.defaults.headers.common['Authorization'];
  
  // Clear token from localStorage if stored there
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
};
