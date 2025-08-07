import { UserType } from "@/lib/types/auth"

export enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid',
}

export enum VehicleType {
  Car = 'Car',
  Van = 'Van',
  Motorbike = 'Motor Bike',
  ThreeWheeler = 'Three Wheeler',
  Truck = 'Truck',
  Farm = 'Farm',
  Plant = 'Plant',
  ElectricBike = 'Electric Bike',
  Other = 'Other',
}

export enum TransmissionType {
  Manual = 'Manual',
  Automatic = 'Automatic',
}

export enum SellerType {
  Dealer = 'Dealer',
  Private = 'Private',
}

export enum ImportStatus {
  UsedImport = 'Used Import',
  NewImport = 'New Import',
  Reconditioned = 'Reconditioned',
}

export enum VehicleCondition {
  Used = 'Used',
  New = 'New',
}

// Image Output Type
export interface VehicleImage {
  id: number
  url: string
}

export enum BodyType {
  Sedan = 'Sedan',
  Hatchback = 'Hatchback',
  SUV = 'SUV',
  Coupe = 'Coupe',
  Convertible = 'Convertible',
  Wagon = 'Wagon',
  Van = 'Van',
  Pickup = 'Pickup',
  Crossover = 'Crossover',
  Minivan = 'Minivan',
  Truck = 'Truck',
  Other = 'Other',
}
// Base Vehicle Type
export interface VehicleBase {
  vehicle_type: VehicleType
  title: string
  make: string
  model: string
  variant?: string
  year: number
  price: number
  mileage: number
  fuel_type: FuelType
  transmission: TransmissionType
  body_type: BodyType
  color?: string
  engine_size?: number
  doors?: number
  registration_date?: number
  location: string
  seller_type: SellerType
  import_status?: ImportStatus
  condition: VehicleCondition
  ownership_history: number
  description: string

  features:string[];

}

// Full Vehicle Output Type
export interface VehicleResponse extends VehicleBase {
  id: number
  posted_by_id: number
  images: VehicleImage[]
}
export interface VehicleByIdResponse extends VehicleBase{
  id: number
  images: VehicleImage[]
  "posted_by": {
        "id": number,
        "email": string,
        "first_name": string,
        "last_name": string,
        "user_type": UserType,
        'phone':number,
        "business_name": string,
        "dealer_profile": {
            "id": number,
            "business_id": string,
            "business_name": string,
            "logo_url": string,
            "rating": number,
            "verified": boolean,
            "reviewCount": number,
            "address": string,
            "phone": string,
            "email": string
        }|null
      }
  // Computed properties for easier access in components
  // dealer?: {
  //   id: number;
  //   name: string;
  //   logo: string;
  //   rating: number;
  //   verified: boolean;
  //   reviewCount: number;
  //   address: string;
  //   phone: string;
  //   email: string;
  // };
  // privateSellerInfo?: {
  //   name: string;
  //   phone: string;
  //   email: string;
  // };
}

// Submenu
export interface VehicleSubmenu {
  [key: string]: {
    label: string
    link: string
  }
}

export type VehicleSubmenus = {
  [key in VehicleType]?: VehicleSubmenu
}
export const vehicleSubmenus: VehicleSubmenus = {
  [VehicleType.Car]: {
    new: { label: 'New Cars', link: '/cars/new' },
    used: { label: 'Used Cars', link: '/cars/used' },
  },
  [VehicleType.Motorbike]: {
    new: { label: 'New Motorbikes', link: '/motorbikes/new' },
    used: { label: 'Used Motorbikes', link: '/motorbikes/used' },
  },
  [VehicleType.ThreeWheeler]: {
    new: { label: 'New Three Wheelers', link: '/threewheelers/new' },
    used: { label: 'Used Three Wheelers', link: '/threewheelers/used' },
  },
  [VehicleType.Truck]: {
    new: { label: 'New Trucks', link: '/trucks/new' },
    used: { label: 'Used Trucks', link: '/trucks/used' },
  },
  [VehicleType.Farm]: {
    new: { label: 'New Farm Vehicles', link: '/farm/new' },
    used: { label: 'Used Farm Vehicles', link: '/farm/used' },
  },
  [VehicleType.Plant]: {
    new: { label: 'New Plant Equipment', link: '/plant/new' },
    used: { label: 'Used Plant Equipment', link: '/plant/used' },
  },
  [VehicleType.ElectricBike]: {
    new: { label: 'New Electric Bikes', link: '/electric-bikes/new' },
    used: { label: 'Used Electric Bikes', link: '/electric-bikes/used' },
  },
  [VehicleType.Van]: {
    new: { label: 'New Vans', link: '/vans/new' },
    used: { label: 'Used Vans', link: '/vans/used' },
  },
  [VehicleType.Other]: {
    new: { label: 'New Other Vehicles', link: '/others/new' },
    used: { label: 'Used Other Vehicles', link: '/others/used' },
  },
}

// API Response Types based on backend OpenAPI spec
export type VehicleSearchResponse = VehicleResponse[]; // Backend returns array directly
export type Vehicle = VehicleResponse; // Alias for consistency

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Vehicle creation schema (matching backend VehicleCreate)
export interface VehicleCreate {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  fuel_type: string;
  transmission: string;
  body_type: string;
  color: string;
  condition: string;
  seller_type: string;
  description?: string;
  image_urls?: string[];
}

// Search parameters for vehicle queries
export interface VehicleSearchParams {
  vehicle_type?: string;
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  location?: string;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  condition?: string;
  seller_type?: string;
  page?: number;
  limit?: number;
}

// Helper types for dropdowns
export interface Make {
  name: string;
  count: number;
}

export interface Model {
  name: string;
  count: number;
}

export interface Location {
  name: string;
  count: number;
}
