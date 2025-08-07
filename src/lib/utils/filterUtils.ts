import type { VehicleFilters } from '@/app/store/filtersSlice';
import type { VehicleSearchParams } from '@/app/Types/CommonTypes';

/**
 * Converts the filter state from filtersSlice to API search parameters
 * @param filters - The current filter state
 * @returns VehicleSearchParams object for the API call
 */
export const convertFiltersToSearchParams = (filters: VehicleFilters): VehicleSearchParams => {
  const params: VehicleSearchParams = {};

  // Basic string filters
  if (filters.make.trim() !== '') {
    params.make = filters.make;
  }

  if (filters.model.trim() !== '') {
    params.model = filters.model;
  }

  if (filters.location.trim() !== '') {
    params.location = filters.location;
  }

  // Vehicle type (now a single string)
  if (filters.vehicle_type.trim() !== '' && filters.vehicle_type !== 'all') {
    params.vehicle_type = filters.vehicle_type;
  }

  // Year range (only if different from default)
  if (filters.yearRange[0] !== 2000 || filters.yearRange[1] !== 2024) {
    params.year_min = filters.yearRange[0];
    params.year_max = filters.yearRange[1];
  }

  // Price range (only if different from default)
  if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000) {
    params.price_min = filters.priceRange[0];
    params.price_max = filters.priceRange[1];
  }

  // Mileage range (only if different from default)
  if (filters.mileageRange[0] !== 0 || filters.mileageRange[1] !== 200000) {
    params.mileage_max = filters.mileageRange[1]; // API only supports max mileage
  }

  // Array filters - take the first value if multiple selected
  // Note: The backend API seems to support single values, not arrays
  if (filters.fuel_type.length > 0) {
    params.fuel_type = filters.fuel_type[0]; // Take first selected fuel type
  }

  if (filters.transmission.length > 0) {
    params.transmission = filters.transmission[0]; // Take first selected transmission
  }

  if (filters.body_type.length > 0) {
    params.body_type = filters.body_type[0]; // Take first selected body type
  }

  if (filters.condition.length > 0) {
    params.condition = filters.condition[0]; // Take first selected condition
  }

  if (filters.seller_type.length > 0) {
    params.seller_type = filters.seller_type[0]; // Take first selected seller type
  }

  return params;
};

/**
 * Checks if the current filters are different from default values
 * @param filters - The current filter state
 * @returns boolean indicating if filters are active
 */
export const hasActiveFilters = (filters: VehicleFilters): boolean => {
  // Check string filters (including vehicle_type)
  if (filters.make.trim() !== '' || 
      filters.model.trim() !== '' || 
      filters.location.trim() !== '' ||
      (filters.vehicle_type.trim() !== '' && filters.vehicle_type !== 'all')) {
    return true;
  }

  // Check range filters
  if (filters.yearRange[0] !== 2000 || filters.yearRange[1] !== 2024) {
    return true;
  }
  
  if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000) {
    return true;
  }
  
  if (filters.mileageRange[0] !== 0 || filters.mileageRange[1] !== 200000) {
    return true;
  }

  // Check array filters
  if (filters.fuel_type.length > 0 ||
      filters.transmission.length > 0 ||
      filters.body_type.length > 0 ||
      filters.condition.length > 0 ||
      filters.seller_type.length > 0 ||
      filters.import_status.length > 0 ||
      filters.color.length > 0 ||
      filters.doors.length > 0) {
    return true;
  }

  // Check engine size range
  if (filters.engine_size[0] !== 0 || filters.engine_size[1] !== 6) {
    return true;
  }

  // Check ownership history range
  if (filters.ownership_history[0] !== 1 || filters.ownership_history[1] !== 10) {
    return true;
  }

  return false;
};
