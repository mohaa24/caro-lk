import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { vehicleApi } from '../api/vehicleApi';
import { 
  VehicleByIdResponse,
  VehicleSearchResponse, 
  VehicleSearchParams, 
  VehicleCreate,
  Make, 
  Model, 
  Location 
} from '@/app/Types/CommonTypes';

// Query keys for React Query
export const VEHICLE_QUERY_KEYS = {
  all: ['vehicles'] as const,
  list: (params?: VehicleSearchParams) => ['vehicles', 'list', params] as const,
  public: (params?: VehicleSearchParams) => ['vehicles', 'public', params] as const,
  detail: (id: string | number) => ['vehicles', 'detail', id] as const,
  makes: () => ['vehicles', 'makes'] as const,
  models: (make: string) => ['vehicles', 'models', make] as const,
  locations: () => ['vehicles', 'locations'] as const,
};

// Custom hook for fetching public vehicles (no auth required)
export const useVehiclesPublic = (
  params?: VehicleSearchParams,
  options?: Omit<UseQueryOptions<VehicleSearchResponse>, 'queryKey' | 'queryFn'>
): UseQueryResult<VehicleSearchResponse> => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.public(params),
    queryFn: () => vehicleApi.getVehiclesPublic(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Custom hook for fetching vehicles (requires auth)
export const useVehicles = (
  params?: VehicleSearchParams,
  options?: Omit<UseQueryOptions<VehicleSearchResponse>, 'queryKey' | 'queryFn'>
): UseQueryResult<VehicleSearchResponse> => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.list(params),
    queryFn: () => vehicleApi.getVehicles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Custom hook for fetching a single vehicle by ID
export const useVehicleById = (
  id: string | number,
  options?: Omit<UseQueryOptions<VehicleByIdResponse>, 'queryKey' | 'queryFn'>
): UseQueryResult<VehicleByIdResponse> => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.detail(id),
    queryFn: () => vehicleApi.getVehicleById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!id, // Only run query if id is provided
    ...options,
  });
};

// Alias for useVehicleById for consistency
export const useVehicle = useVehicleById;

// Custom hook for fetching available makes
export const useMakes = (
  options?: Omit<UseQueryOptions<Make[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Make[]> => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.makes(),
    queryFn: vehicleApi.getMakes,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

// Custom hook for fetching models for a specific make
export const useModels = (
  make: string,
  options?: Omit<UseQueryOptions<Model[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Model[]> => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.models(make),
    queryFn: () => vehicleApi.getModels(make),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: !!make, // Only run query if make is provided
    ...options,
  });
};

// Custom hook for fetching available locations
export const useLocations = (
  options?: Omit<UseQueryOptions<Location[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Location[]> => {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.locations(),
    queryFn: vehicleApi.getLocations,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

// Mutation hook for creating a new vehicle
export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleData: VehicleCreate) => vehicleApi.createVehicle(vehicleData),
    onSuccess: () => {
      // Invalidate and refetch vehicles list
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.all });
    },
    onError: (error) => {
      console.error('Error creating vehicle:', error);
    },
  });
};
