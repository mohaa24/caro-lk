import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDealers, 
  getDealerById, 
  getDealerVehicles, 
  updateDealerProfile,
  searchDealersByLocation,
  type DealerProfile
} from '../api/dealerApi';

// Hook to get all dealers with pagination and filters
export const useDealers = (params?: {
  page?: number;
  size?: number;
  city?: string;
  province?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['dealers', params],
    queryFn: () => getDealers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a single dealer by ID
export const useDealer = (dealerId: number | undefined) => {
  return useQuery({
    queryKey: ['dealer', dealerId],
    queryFn: () => getDealerById(dealerId!),
    enabled: !!dealerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get dealer's vehicles
export const useDealerVehicles = (
  dealerId: number | undefined,
  params?: {
    page?: number;
    size?: number;
    min_price?: number;
    max_price?: number;
    fuel_type?: string;
    transmission?: string;
    condition?: string;
    make?: string;
    model?: string;
  }
) => {
  return useQuery({
    queryKey: ['dealerVehicles', dealerId, params],
    queryFn: () => getDealerVehicles(dealerId!, params),
    enabled: !!dealerId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to update dealer profile (for authenticated dealers)
export const useUpdateDealerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealerId, data }: { dealerId: number; data: Partial<DealerProfile> }) =>
      updateDealerProfile(dealerId, data),
    onSuccess: (updatedDealer) => {
      // Update the dealer cache
      queryClient.setQueryData(['dealer', updatedDealer.id], updatedDealer);
      
      // Invalidate dealers list to refresh
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
    },
    onError: (error) => {
      console.error('Failed to update dealer profile:', error);
    },
  });
};

// Hook to search dealers by location
export const useDealersByLocation = (
  latitude?: number,
  longitude?: number,
  radius?: number
) => {
  return useQuery({
    queryKey: ['dealersLocation', latitude, longitude, radius],
    queryFn: () => searchDealersByLocation(latitude!, longitude!, radius),
    enabled: !!(latitude && longitude),
    staleTime: 10 * 60 * 1000, // 10 minutes (location searches are more stable)
  });
};

// Hook for prefetching dealer data (useful for hover effects, etc.)
export const usePrefetchDealer = () => {
  const queryClient = useQueryClient();

  return (dealerId: number) => {
    queryClient.prefetchQuery({
      queryKey: ['dealer', dealerId],
      queryFn: () => getDealerById(dealerId),
      staleTime: 5 * 60 * 1000,
    });
  };
};

// Hook for prefetching dealer vehicles
export const usePrefetchDealerVehicles = () => {
  const queryClient = useQueryClient();

  return (dealerId: number, params?: {
    page?: number;
    size?: number;
    min_price?: number;
    max_price?: number;
    fuel_type?: string;
    transmission?: string;
    condition?: string;
    make?: string;
    model?: string;
  }) => {
    queryClient.prefetchQuery({
      queryKey: ['dealerVehicles', dealerId, params],
      queryFn: () => getDealerVehicles(dealerId, params),
      staleTime: 2 * 60 * 1000,
    });
  };
};
