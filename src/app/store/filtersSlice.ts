import { create } from 'zustand';
import {
    VehicleType,
    FuelType,
    TransmissionType,
    BodyType,
    SellerType,
    ImportStatus,
    VehicleCondition
} from '@/app/Types/CommonTypes';

// Filter Interfaces
export interface VehicleFilters {
    vehicle_type: VehicleType[];
    make: string;
    model: string;
    variant: string;
    yearRange: [number, number];
    priceRange: [number, number];
    mileageRange: [number, number];
    fuel_type: FuelType[];
    transmission: TransmissionType[];
    body_type: BodyType[];
    color: string[];
    engine_size: [number, number];
    doors: number[];
    location: string;
    seller_type: SellerType[];
    import_status: ImportStatus[];
    condition: VehicleCondition[];
    ownership_history: [number, number];
}

export interface VehicleFiltersStore {
    filters: VehicleFilters;
    setFilter: <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) => void;
    clearAllFilters: () => void;
    clearFilter: (key: keyof VehicleFilters) => void;
    getActiveFiltersCount: () => number;
}

// Default filter values
const defaultFilters: VehicleFilters = {
    vehicle_type: [],
    make: '',
    model: '',
    variant: '',
    yearRange: [2000, 2024] as [number, number],
    priceRange: [0, 100000] as [number, number],
    mileageRange: [0, 200000] as [number, number],
    fuel_type: [],
    transmission: [],
    body_type: [],
    color: [],
    engine_size: [0, 6] as [number, number],
    doors: [],
    location: '',
    seller_type: [],
    import_status: [],
    condition: [],
    ownership_history: [1, 10] as [number, number],
};

// Zustand store
export const useVehicleFilters = create<VehicleFiltersStore>((set, get) => ({
    filters: { ...defaultFilters },

    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),

    clearAllFilters: () => set(() => ({
        filters: { ...defaultFilters }
    })),

    clearFilter: (key) => set((state) => {
        const newFilters = { ...state.filters };
        switch (key) {
            case 'vehicle_type':
            case 'fuel_type':
            case 'transmission':
            case 'body_type':
            case 'color':
            case 'doors':
            case 'seller_type':
            case 'import_status':
            case 'condition':
                (newFilters[key] as string[] | VehicleType[] | FuelType[] | TransmissionType[] | BodyType[] | number[] | SellerType[] | ImportStatus[] | VehicleCondition[]) = [];
                break;
            case 'make':
            case 'model':
            case 'variant':
            case 'location':
                (newFilters[key] as string) = '';
                break;
            case 'yearRange':
                newFilters[key] = [2000, 2024];
                break;
            case 'priceRange':
                newFilters[key] = [0, 100000];
                break;
            case 'mileageRange':
                newFilters[key] = [0, 200000];
                break;
            case 'engine_size':
                newFilters[key] = [0, 6];
                break;
            case 'ownership_history':
                newFilters[key] = [1, 10];
                break;
        }
        return { filters: newFilters };
    }),

    getActiveFiltersCount: () => {
        const { filters } = get();
        let count = 0;

        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                if (key === 'yearRange' || key === 'priceRange' || key === 'mileageRange' ||
                    key === 'engine_size' || key === 'ownership_history') {
                    // For ranges, check if they differ from default
                    if (key === 'yearRange' && (value[0] !== 2000 || value[1] !== 2024)) count++;
                    else if (key === 'priceRange' && (value[0] !== 0 || value[1] !== 100000)) count++;
                    else if (key === 'mileageRange' && (value[0] !== 0 || value[1] !== 200000)) count++;
                    else if (key === 'engine_size' && (value[0] !== 0 || value[1] !== 6)) count++;
                    else if (key === 'ownership_history' && (value[0] !== 1 || value[1] !== 10)) count++;
                } else {
                    count++;
                }
            } else if (typeof value === 'string' && value.trim() !== '') {
                count++;
            }
        });

        return count;
    }
}));
