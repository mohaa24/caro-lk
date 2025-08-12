// API Configuration and Client exports
export { apiClient, handleApiResponse, handleApiError } from './client';
export { API_CONFIG, API_ENDPOINTS, getBaseURL, BASE_URL } from './config';

// Vehicle API exports
export { vehicleApi } from './vehicleApi';

// Image API exports
export { imageApi } from './imageApi';
export type { ImageUploadResponse } from './imageApi';

export type {
  VehicleSearchParams,
  VehicleSearchResponse,
  Make,
  Model,
  Location,
} from './vehicleApi';

// React Query Hooks exports
export {
  useVehicles,
  useVehiclesPublic,
  useVehicleById,
  useVehicle,
  useMakes,
  useModels,
  useLocations,
  useCreateVehicle,
  VEHICLE_QUERY_KEYS,
} from '../hooks/useVehicles';

// Image Hooks exports
export {
  useUploadSingleImage,
  useUploadMultipleImages,
  useDeleteImage,
} from '../hooks/useImages';

// Providers exports
export { ReactQueryProvider } from '../providers/ReactQueryProvider';
