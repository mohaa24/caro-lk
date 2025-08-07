import { VehicleFilters } from '@/app/store/filtersSlice';
import { 
  FuelType, 
  TransmissionType, 
  BodyType, 
  SellerType, 
  ImportStatus, 
  VehicleCondition 
} from '@/app/Types/CommonTypes';
import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Converts filter state to URL search parameters
 */
export const filtersToURLParams = (filters: VehicleFilters): URLSearchParams => {
  const params = new URLSearchParams();

  // String filters
  if (filters.make.trim() !== '') {
    params.set('make', filters.make);
  }
  if (filters.model.trim() !== '') {
    params.set('model', filters.model);
  }
  if (filters.variant.trim() !== '') {
    params.set('variant', filters.variant);
  }
  if (filters.location.trim() !== '') {
    params.set('location', filters.location);
  }
  if (filters.vehicle_type !== 'all') {
    params.set('vehicle_type', filters.vehicle_type);
  }

  // Range filters (only if different from defaults)
  if (filters.yearRange[0] !== 2000 || filters.yearRange[1] !== 2024) {
    params.set('year_min', filters.yearRange[0].toString());
    params.set('year_max', filters.yearRange[1].toString());
  }

  if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 100000) {
    params.set('price_min', filters.priceRange[0].toString());
    params.set('price_max', filters.priceRange[1].toString());
  }

  if (filters.mileageRange[0] !== 0 || filters.mileageRange[1] !== 200000) {
    params.set('mileage_min', filters.mileageRange[0].toString());
    params.set('mileage_max', filters.mileageRange[1].toString());
  }

  if (filters.engine_size[0] !== 0 || filters.engine_size[1] !== 6) {
    params.set('engine_min', filters.engine_size[0].toString());
    params.set('engine_max', filters.engine_size[1].toString());
  }

  if (filters.ownership_history[0] !== 1 || filters.ownership_history[1] !== 10) {
    params.set('owners_min', filters.ownership_history[0].toString());
    params.set('owners_max', filters.ownership_history[1].toString());
  }

  // Array filters
  if (filters.fuel_type.length > 0) {
    params.set('fuel_type', filters.fuel_type.join(','));
  }
  if (filters.transmission.length > 0) {
    params.set('transmission', filters.transmission.join(','));
  }
  if (filters.body_type.length > 0) {
    params.set('body_type', filters.body_type.join(','));
  }
  if (filters.color.length > 0) {
    params.set('color', filters.color.join(','));
  }
  if (filters.doors.length > 0) {
    params.set('doors', filters.doors.join(','));
  }
  if (filters.seller_type.length > 0) {
    params.set('seller_type', filters.seller_type.join(','));
  }
  if (filters.import_status.length > 0) {
    params.set('import_status', filters.import_status.join(','));
  }
  if (filters.condition.length > 0) {
    params.set('condition', filters.condition.join(','));
  }

  return params;
};

/**
 * Converts URL search parameters to filter state
 */
export const urlParamsToFilters = (searchParams: ReadonlyURLSearchParams): Partial<VehicleFilters> => {
  const filters: Partial<VehicleFilters> = {};

  // String filters
  const make = searchParams.get('make');
  if (make) filters.make = make;

  const model = searchParams.get('model');
  if (model) filters.model = model;

  const variant = searchParams.get('variant');
  if (variant) filters.variant = variant;

  const location = searchParams.get('location');
  if (location) filters.location = location;

  const vehicle_type = searchParams.get('vehicle_type');
  if (vehicle_type) filters.vehicle_type = vehicle_type;

  // Range filters
  const year_min = searchParams.get('year_min');
  const year_max = searchParams.get('year_max');
  if (year_min || year_max) {
    filters.yearRange = [
      year_min ? parseInt(year_min) : 2000,
      year_max ? parseInt(year_max) : 2024
    ] as [number, number];
  }

  const price_min = searchParams.get('price_min');
  const price_max = searchParams.get('price_max');
  if (price_min || price_max) {
    filters.priceRange = [
      price_min ? parseInt(price_min) : 0,
      price_max ? parseInt(price_max) : 100000
    ] as [number, number];
  }

  const mileage_min = searchParams.get('mileage_min');
  const mileage_max = searchParams.get('mileage_max');
  if (mileage_min || mileage_max) {
    filters.mileageRange = [
      mileage_min ? parseInt(mileage_min) : 0,
      mileage_max ? parseInt(mileage_max) : 200000
    ] as [number, number];
  }

  const engine_min = searchParams.get('engine_min');
  const engine_max = searchParams.get('engine_max');
  if (engine_min || engine_max) {
    filters.engine_size = [
      engine_min ? parseFloat(engine_min) : 0,
      engine_max ? parseFloat(engine_max) : 6
    ] as [number, number];
  }

  const owners_min = searchParams.get('owners_min');
  const owners_max = searchParams.get('owners_max');
  if (owners_min || owners_max) {
    filters.ownership_history = [
      owners_min ? parseInt(owners_min) : 1,
      owners_max ? parseInt(owners_max) : 10
    ] as [number, number];
  }

  // Array filters
  const fuel_type = searchParams.get('fuel_type');
  if (fuel_type) {
    filters.fuel_type = fuel_type.split(',') as FuelType[];
  }

  const transmission = searchParams.get('transmission');
  if (transmission) {
    filters.transmission = transmission.split(',') as TransmissionType[];
  }

  const body_type = searchParams.get('body_type');
  if (body_type) {
    filters.body_type = body_type.split(',') as BodyType[];
  }

  const color = searchParams.get('color');
  if (color) {
    filters.color = color.split(',');
  }

  const doors = searchParams.get('doors');
  if (doors) {
    filters.doors = doors.split(',').map(d => parseInt(d));
  }

  const seller_type = searchParams.get('seller_type');
  if (seller_type) {
    filters.seller_type = seller_type.split(',') as SellerType[];
  }

  const import_status = searchParams.get('import_status');
  if (import_status) {
    filters.import_status = import_status.split(',') as ImportStatus[];
  }

  const condition = searchParams.get('condition');
  if (condition) {
    filters.condition = condition.split(',') as VehicleCondition[];
  }

  return filters;
};
