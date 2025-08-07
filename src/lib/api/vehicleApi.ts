import { apiClient, handleApiResponse, handleApiError } from './client';
import { API_ENDPOINTS } from './config';
import { 
  VehicleResponse, 
  VehicleByIdResponse,
  VehicleSearchResponse, 
  VehicleSearchParams, 
  VehicleCreate,
  Make,
  Model,
  Location,
  SellerType 
} from '@/app/Types/CommonTypes';
import { AxiosError } from 'axios';

// Transform raw API response to include computed properties
const transformVehicleByIdResponse = (data: Partial<VehicleByIdResponse>): VehicleByIdResponse => {
  const transformed = { ...data } as VehicleByIdResponse;
  
  // Add dealer computed property for easier access
  if (transformed.seller_type === SellerType.Dealer && transformed.posted_by?.dealer_profile) {
    const dealerProfile = transformed.posted_by.dealer_profile;
    transformed.dealer = {
      id: dealerProfile.id,
      name: dealerProfile.business_name,
      logo: dealerProfile.logo_url,
      rating: dealerProfile.rating,
      verified: dealerProfile.verified || false,
      reviewCount: dealerProfile.reviewCount || 0,
      address: dealerProfile.address || '',
      phone: dealerProfile.phone || '',
      email: dealerProfile.email || '',
    };
  }
  
  // Add private seller info computed property
  if (transformed.seller_type === SellerType.Private && transformed.posted_by) {
    const postedBy = transformed.posted_by;
    transformed.privateSellerInfo = {
      name: `${postedBy.first_name} ${postedBy.last_name}`.trim(),
      phone: '', // Note: phone not available in posted_by, would need to be added to API
      email: postedBy.email || '',
    };
  }
  
  return transformed;
};

// Vehicle API functions
export const vehicleApi = {
  // Get vehicles (public access - no auth required)
  getVehiclesPublic: async (params?: VehicleSearchParams): Promise<VehicleSearchResponse> => {
    try {
      const response = await apiClient.get<VehicleSearchResponse>(
        API_ENDPOINTS.VEHICLES_PUBLIC,
        { params }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get vehicles (authenticated access)
  getVehicles: async (params?: VehicleSearchParams): Promise<VehicleSearchResponse> => {
    try {
      const response = await apiClient.get<VehicleSearchResponse>(
        API_ENDPOINTS.VEHICLES,
        { params }
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id: string | number): Promise<VehicleByIdResponse> => {
    try {
      const response = await apiClient.get<VehicleByIdResponse>(
        API_ENDPOINTS.VEHICLE_BY_ID(id)
      );
      const rawData = handleApiResponse(response);
      return transformVehicleByIdResponse(rawData);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Create new vehicle (requires authentication)
  createVehicle: async (vehicleData: VehicleCreate): Promise<VehicleResponse> => {
    try {
      const response = await apiClient.post<VehicleResponse>(
        API_ENDPOINTS.VEHICLES,
        vehicleData
      );
      return handleApiResponse(response);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get available makes (placeholder - not implemented in backend yet)
  getMakes: async (): Promise<Make[]> => {
    try {
      // TODO: Implement when backend adds this endpoint
      // For now, we can extract makes from all vehicles
      const vehicles = await vehicleApi.getVehiclesPublic();
      const makeCounts: Record<string, number> = {};
      
      vehicles.forEach(vehicle => {
        makeCounts[vehicle.make] = (makeCounts[vehicle.make] || 0) + 1;
      });
      
      return Object.entries(makeCounts).map(([name, count]) => ({ name, count }));
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get models for a specific make (placeholder - not implemented in backend yet)
  getModels: async (make: string): Promise<Model[]> => {
    try {
      // TODO: Implement when backend adds this endpoint
      const vehicles = await vehicleApi.getVehiclesPublic({ make });
      const modelCounts: Record<string, number> = {};
      
      vehicles.forEach(vehicle => {
        if (vehicle.make === make) {
          modelCounts[vehicle.model] = (modelCounts[vehicle.model] || 0) + 1;
        }
      });
      
      return Object.entries(modelCounts).map(([name, count]) => ({ name, count }));
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // Get available locations (placeholder - not implemented in backend yet)
  getLocations: async (): Promise<Location[]> => {
    try {
      // TODO: Implement when backend adds this endpoint
      const vehicles = await vehicleApi.getVehiclesPublic();
      const locationCounts: Record<string, number> = {};
      
      vehicles.forEach(vehicle => {
        locationCounts[vehicle.location] = (locationCounts[vehicle.location] || 0) + 1;
      });
      
      return Object.entries(locationCounts).map(([name, count]) => ({ name, count }));
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

// Export types for use in components
export type {
  VehicleSearchParams,
  VehicleSearchResponse,
  Make,
  Model,
  Location,
};
