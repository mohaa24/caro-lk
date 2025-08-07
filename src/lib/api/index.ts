// API Configuration and Client exports
export { apiClient, handleApiResponse, handleApiError } from './client';
export { API_CONFIG, API_ENDPOINTS, getBaseURL, BASE_URL } from './config';

// Vehicle API exports
export { vehicleApi } from './vehicleApi';
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
  useVehicleById,
  useVehicleSearch,
  useMakes,
  useModels,
  useLocations,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  VEHICLE_QUERY_KEYS,
} from '../hooks/useVehicles';

// Providers exports
export { ReactQueryProvider, queryClient } from '../providers/ReactQueryProvider';
