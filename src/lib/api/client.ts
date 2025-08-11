import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { BASE_URL } from './config';

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add auth token if available
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error: AxiosError) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
      }
      
      return response;
    },
    (error: AxiosError) => {
      // Handle common error cases
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data || error.message;
        
        // Log error in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${status}`, message);
        }
        
        // Handle specific status codes
        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('authToken');
              // You can add redirect logic here
            }
            break;
          case 403:
            // Forbidden
            console.error('Access forbidden');
            break;
          case 404:
            // Not found
            console.error('Resource not found');
            break;
          case 500:
            // Server error
            console.error('Internal server error');
            break;
          default:
            console.error('API Error:', message);
        }
      } else if (error.request) {
        // Network error
        console.error('Network error:', error.message);
      } else {
        // Other error
        console.error('Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the configured axios instance
export const apiClient = createApiClient();

// Utility function to handle API responses
export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

// Utility function to handle API errors
export const handleApiError = (error: AxiosError): never => {
  if (error.response) {
    throw new Error(`API Error: ${error.response.status} - ${error.response.data || error.message}`);
  } else if (error.request) {
    throw new Error('Network Error: Unable to connect to the server');
  } else {
    throw new Error(`Error: ${error.message}`);
  }
};
