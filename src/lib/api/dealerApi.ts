import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

// Types for dealer data (you can expand these based on your API)
export interface DealerProfile {
  id: number;
  user_id: number;
  business_id?: string | null;
  business_name?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  description?: string | null;
  rating?: number;
  reviews_count?: number;
  established_year?: number;
  staff_count?: number;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DealerVehicle {
  id: number;
  dealer_id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  condition: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DealerListResponse {
  dealers: DealerProfile[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface DealerVehiclesResponse {
  vehicles: DealerVehicle[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Get all dealers (with pagination and filters)
export const getDealers = async (params?: {
  page?: number;
  size?: number;
  city?: string;
  province?: string;
  search?: string;
}): Promise<DealerListResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.size) searchParams.append('size', params.size.toString());
    if (params?.city) searchParams.append('city', params.city);
    if (params?.province) searchParams.append('province', params.province);
    if (params?.search) searchParams.append('search', params.search);

    const response = await apiClient.get<DealerListResponse>(
      `${API_ENDPOINTS.DEALERS.LIST}?${searchParams.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Get dealers error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dealers';
    throw new Error(errorMessage);
  }
};

// Get single dealer by ID
export const getDealerById = async (dealerId: number): Promise<DealerProfile> => {
  try {
    const response = await apiClient.get<DealerProfile>(
      `${API_ENDPOINTS.DEALERS.DETAIL.replace('{id}', dealerId.toString())}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Get dealer error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dealer';
    throw new Error(errorMessage);
  }
};

// Get dealer's vehicles
export const getDealerVehicles = async (
  dealerId: number,
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
): Promise<DealerVehiclesResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.size) searchParams.append('size', params.size.toString());
    if (params?.min_price) searchParams.append('min_price', params.min_price.toString());
    if (params?.max_price) searchParams.append('max_price', params.max_price.toString());
    if (params?.fuel_type) searchParams.append('fuel_type', params.fuel_type);
    if (params?.transmission) searchParams.append('transmission', params.transmission);
    if (params?.condition) searchParams.append('condition', params.condition);
    if (params?.make) searchParams.append('make', params.make);
    if (params?.model) searchParams.append('model', params.model);

    const response = await apiClient.get<DealerVehiclesResponse>(
      `${API_ENDPOINTS.DEALERS.VEHICLES.replace('{id}', dealerId.toString())}?${searchParams.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Get dealer vehicles error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dealer vehicles';
    throw new Error(errorMessage);
  }
};

// Update dealer profile (for authenticated dealers)
export const updateDealerProfile = async (
  dealerId: number,
  data: Partial<DealerProfile>
): Promise<DealerProfile> => {
  try {
    const response = await apiClient.put<DealerProfile>(
      `${API_ENDPOINTS.DEALERS.UPDATE.replace('{id}', dealerId.toString())}`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Update dealer profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update dealer profile';
    throw new Error(errorMessage);
  }
};

// Search dealers by location
export const searchDealersByLocation = async (
  latitude: number,
  longitude: number,
  radius?: number
): Promise<DealerProfile[]> => {
  try {
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
    });
    
    if (radius) {
      params.append('radius', radius.toString());
    }

    const response = await apiClient.get<DealerProfile[]>(
      `${API_ENDPOINTS.DEALERS.SEARCH_LOCATION}?${params.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Search dealers by location error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search dealers';
    throw new Error(errorMessage);
  }
};
