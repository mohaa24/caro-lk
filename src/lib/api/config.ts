// API Configuration
export const API_CONFIG = {
  // Base URLs for different environments
  LOCAL: process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:8001',
  DEVELOPMENT: process.env.NEXT_PUBLIC_DEV_API_URL || 'https://dev-api.caro.lk',
  STAGING: process.env.NEXT_PUBLIC_STAGING_API_URL || 'https://staging-api.caro.lk',
  PRODUCTION: process.env.NEXT_PUBLIC_PROD_API_URL || 'https://api.caro.lk',
} as const;

// Current environment - you can change this or use environment variables
const getCurrentEnvironment = (): keyof typeof API_CONFIG => {
  // Allow complete override of API URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    // If a custom API URL is set, we'll use LOCAL for the key but override the URL
    return 'LOCAL';
  }
  
  // Use environment variable to determine if we should use local API
  if (process.env.NEXT_PUBLIC_USE_LOCAL_API === 'true') {
    return 'LOCAL';
  }
  
  // Production environment logic
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_ENVIRONMENT === 'staging' ? 'STAGING' : 'PRODUCTION';
  }
  
  // Development environment - default to DEVELOPMENT unless local is specified
  return 'DEVELOPMENT';
};

// Get the current base URL
export const getBaseURL = (): string => {
  // Allow complete override
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  const environment = getCurrentEnvironment();
  return API_CONFIG[environment];
};

// API Endpoints
export const API_ENDPOINTS = {
  // Vehicle endpoints
  VEHICLES: '/api/vehicles', // Protected - requires auth
  VEHICLES_PUBLIC: '/api/vehicles/public', // Public access
  VEHICLE_BY_ID: (id: string | number) => `/api/vehicles/${id}`,
  
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REGISTER_SIMPLE: '/auth/register-simple',
    TOKEN: '/auth/token', // OAuth2 form login for docs
    ME: '/auth/me',
  },
  
  // Dealer endpoints
  DEALER_PROFILE: '/api/dealer-profile',
  DEALER_PROFILE_BY_USER_ID: (userId: string | number) => `/api/dealer-profile/${userId}`,
  
  // Future filter endpoints (not yet implemented in backend)
  MAKES: '/api/vehicles/makes',
  MODELS: (make: string) => `/api/vehicles/makes/${make}/models`,
  LOCATIONS: '/api/locations',
  
  // Dealer endpoints (future)
  DEALERS: {
    LIST: '/dealers',
    DETAIL: '/dealers/{id}',
    VEHICLES: '/dealers/{id}/vehicles',
    UPDATE: '/dealers/{id}',
    SEARCH_LOCATION: '/dealers/search/location',
  },
  DEALER_BY_ID: (id: string | number) => `/dealers/${id}`,
} as const;

// Export the current base URL for easy access
export const BASE_URL = getBaseURL();
