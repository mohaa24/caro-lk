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
  try {
    // First, login to get the token
    const token = await loginUser(credentials);
    
    // Set the token in the API client
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token.access_token}`;
    
    // Get user information
    const user = await getCurrentUser();
    
    return { user, token };
  } catch (error) {
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
