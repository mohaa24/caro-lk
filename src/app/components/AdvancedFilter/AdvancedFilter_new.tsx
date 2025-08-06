import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { create } from 'zustand';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  SlidersHorizontal, 
  Car, 
  Fuel, 
  Calendar, 
  MapPin,
  Search
} from 'lucide-react';
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
interface VehicleFilters {
  vehicle_type: VehicleType[];
  make: string[];
  model: string[];
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

interface VehicleFiltersStore {
  filters: VehicleFilters;
  setFilter: <K extends keyof VehicleFilters>(key: K, value: VehicleFilters[K]) => void;
  clearAllFilters: () => void;
  clearFilter: (key: keyof VehicleFilters) => void;
  getActiveFiltersCount: () => number;
}

interface FilterPill {
  key: string;
  label: string;
  parentKey?: keyof VehicleFilters;
  value?: string | number;
}

interface QuickFiltersProps {
  onOpenAdvanced: () => void;
  scrollToSection: (sectionId: string) => void;
}

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  sectionId?: string;
}

interface CheckboxGroupProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  columns?: number;
}

interface RangeSliderProps {
  label: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  formatter?: (value: number) => string;
}

interface AdvancedFiltersModalProps {
  children: ReactNode;
  onScrollToSection: (scrollFn: (sectionId: string) => void) => void;
}

interface VehicleCardProps {
  vehicle: {
    title: string;
    year: number;
    price: number;
    mileage: number;
    location: string;
  };
}

// Sample data
const popularMakes = [
  'Toyota', 'Honda', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 
  'Ford', 'Nissan', 'Hyundai', 'Mazda', 'Subaru', 'Lexus'
];

// Zustand store
const useVehicleFilters = create<VehicleFiltersStore>((set, get) => ({
  filters: {
    vehicle_type: [],
    make: [],
    model: [],
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
  },
  
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value }
  })),
  
  clearAllFilters: () => set(() => ({
    filters: {
      vehicle_type: [],
      make: [],
      model: [],
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
    }
  })),
  
  clearFilter: (key) => set((state) => {
    const newFilters = { ...state.filters };
    switch (key) {
      case 'vehicle_type':
      case 'make':
      case 'model':
      case 'fuel_type':
      case 'transmission':
      case 'body_type':
      case 'color':
      case 'doors':
      case 'seller_type':
      case 'import_status':
      case 'condition':
        (newFilters[key] as any[]) = [];
        break;
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

// Filter Pills Component
const FilterPills: React.FC = () => {
  const { filters, clearFilter } = useVehicleFilters();
  
  const getFilterPills = (): FilterPill[] => {
    const pills: FilterPill[] = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        if (['yearRange', 'priceRange', 'mileageRange', 'engine_size', 'ownership_history'].includes(key)) {
          // Handle range filters
          if (key === 'yearRange' && (value[0] !== 2000 || value[1] !== 2024)) {
            pills.push({ key, label: `Year: ${value[0]} - ${value[1]}` });
          } else if (key === 'priceRange' && (value[0] !== 0 || value[1] !== 100000)) {
            pills.push({ key, label: `Price: £${value[0].toLocaleString()} - £${value[1].toLocaleString()}` });
          } else if (key === 'mileageRange' && (value[0] !== 0 || value[1] !== 200000)) {
            pills.push({ key, label: `Mileage: ${value[0].toLocaleString()} - ${value[1].toLocaleString()}` });
          } else if (key === 'engine_size' && (value[0] !== 0 || value[1] !== 6)) {
            pills.push({ key, label: `Engine: ${value[0]}L - ${value[1]}L` });
          } else if (key === 'ownership_history' && (value[0] !== 1 || value[1] !== 10)) {
            pills.push({ key, label: `Owners: ${value[0]} - ${value[1]}` });
          }
        } else {
          // Handle array filters
          value.forEach(item => {
            pills.push({ key: `${key}-${item}`, label: String(item), parentKey: key as keyof VehicleFilters, value: item });
          });
        }
      } else if (typeof value === 'string' && value.trim() !== '') {
        pills.push({ key, label: `${key.replace('_', ' ')}: ${value}` });
      }
    });
    
    return pills;
  };

  const handleRemovePill = (pill: FilterPill) => {
    if (pill.parentKey && pill.value) {
      // Remove specific item from array
      const currentValues = filters[pill.parentKey] as any[];
      const newValues = currentValues.filter(item => item !== pill.value);
      useVehicleFilters.getState().setFilter(pill.parentKey, newValues);
    } else {
      // Clear entire filter
      clearFilter(pill.key as keyof VehicleFilters);
    }
  };

  const pills = getFilterPills();

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {pills.map((pill) => (
        <Badge
          key={pill.key}
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1"
        >
          {pill.label}
          <button
            onClick={() => handleRemovePill(pill)}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={useVehicleFilters.getState().clearAllFilters}
        className="text-sm text-gray-600 hover:text-gray-800"
      >
        Clear All
      </Button>
    </div>
  );
};

// Quick Filter Buttons Component
const QuickFilters: React.FC<QuickFiltersProps> = ({ onOpenAdvanced, scrollToSection }) => {
  const { filters } = useVehicleFilters();

  const quickFilterButtons = [
    {
      label: 'Make & Model',
      icon: Car,
      section: 'make-model',
      hasValue: filters.make.length > 0 || filters.model.length > 0
    },
    {
      label: 'Body Type',
      icon: Car,
      section: 'body-type',
      hasValue: filters.body_type.length > 0
    },
    {
      label: 'Fuel Type',
      icon: Fuel,
      section: 'fuel-transmission',
      hasValue: filters.fuel_type.length > 0
    },
    {
      label: 'Year',
      icon: Calendar,
      section: 'year-price',
      hasValue: filters.yearRange[0] !== 2000 || filters.yearRange[1] !== 2024
    },
    {
      label: 'Location',
      icon: MapPin,
      section: 'location',
      hasValue: filters.location !== ''
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {quickFilterButtons.map((button) => (
        <Button
          key={button.label}
          variant={button.hasValue ? "default" : "outline"}
          size="sm"
          onClick={() => {
            onOpenAdvanced();
            setTimeout(() => scrollToSection(button.section), 100);
          }}
          className="flex items-center gap-2"
        >
          <button.icon className="h-4 w-4" />
          {button.label}
        </Button>
      ))}
    </div>
  );
};

// Collapsible Filter Section Component
const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = false, sectionId }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div id={sectionId} className="border-b border-gray-200 py-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-between p-0 font-semibold text-left hover:bg-transparent"
          >
            <span>{title}</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          {children}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

// Multi-select Checkbox Group
const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ options, value, onChange, columns = 2 }) => {
  return (
    <div className={`grid grid-cols-${columns} gap-2`}>
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={option}
            checked={value.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange([...value, option]);
              } else {
                onChange(value.filter(item => item !== option));
              }
            }}
          />
          <Label htmlFor={option} className="text-sm font-normal cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
};

// Range Slider Component
const RangeSlider: React.FC<RangeSliderProps> = ({ label, value, onChange, min, max, step = 1, formatter }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-gray-600">
          {formatter ? formatter(value[0]) : value[0]} - {formatter ? formatter(value[1]) : value[1]}
        </span>
      </div>
      <Slider
        value={value}
        onValueChange={(newValue) => onChange(newValue as [number, number])}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  );
};

// Advanced Filters Modal
const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({ children, onScrollToSection }) => {
  const { filters, setFilter, getActiveFiltersCount, clearAllFilters } = useVehicleFilters();
  const [selectedMake, setSelectedMake] = useState('');
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (sectionId: string) => {
    const element = scrollRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    onScrollToSection(scrollToSection);
  }, [onScrollToSection]);

  const formatPrice = (price: number) => `£${price.toLocaleString()}`;
  const formatMileage = (mileage: number) => `${mileage.toLocaleString()} mi`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Advanced Filters
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{getActiveFiltersCount()} active</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {/* Vehicle Type */}
            <div ref={el => scrollRefs.current['vehicle-type'] = el}>
              <FilterSection title="Vehicle Type" sectionId="vehicle-type" defaultOpen>
                <CheckboxGroup
                  options={Object.values(VehicleType)}
                  value={filters.vehicle_type}
                  onChange={(value) => setFilter('vehicle_type', value as VehicleType[])}
                  columns={2}
                />
              </FilterSection>
            </div>

            {/* Make & Model */}
            <div ref={el => scrollRefs.current['make-model'] = el}>
              <FilterSection title="Make & Model" sectionId="make-model">
                <div className="space-y-4">
                  <div>
                    <Label>Make</Label>
                    <Select
                      value={selectedMake}
                      onValueChange={(value) => {
                        setSelectedMake(value);
                        if (!filters.make.includes(value) && value) {
                          setFilter('make', [...filters.make, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        {popularMakes.map(make => (
                          <SelectItem key={make} value={make}>{make}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {filters.make.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {filters.make.map(make => (
                          <Badge key={make} variant="secondary" className="text-xs">
                            {make}
                            <button
                              onClick={() => setFilter('make', filters.make.filter(m => m !== make))}
                              className="ml-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="variant">Variant</Label>
                    <Input
                      id="variant"
                      placeholder="e.g., SE, Sport, Limited"
                      value={filters.variant}
                      onChange={(e) => setFilter('variant', e.target.value)}
                    />
                  </div>
                </div>
              </FilterSection>
            </div>

            {/* Year & Price */}
            <div ref={el => scrollRefs.current['year-price'] = el}>
              <FilterSection title="Year & Price" sectionId="year-price">
                <div className="space-y-6">
                  <RangeSlider
                    label="Year"
                    value={filters.yearRange}
                    onChange={(value) => setFilter('yearRange', value)}
                    min={1990}
                    max={2024}
                  />
                  <RangeSlider
                    label="Price"
                    value={filters.priceRange}
                    onChange={(value) => setFilter('priceRange', value)}
                    min={0}
                    max={100000}
                    step={1000}
                    formatter={formatPrice}
                  />
                  <RangeSlider
                    label="Mileage"
                    value={filters.mileageRange}
                    onChange={(value) => setFilter('mileageRange', value)}
                    min={0}
                    max={200000}
                    step={1000}
                    formatter={formatMileage}
                  />
                </div>
              </FilterSection>
            </div>

            {/* Body Type */}
            <div ref={el => scrollRefs.current['body-type'] = el}>
              <FilterSection title="Body Type" sectionId="body-type">
                <CheckboxGroup
                  options={Object.values(BodyType)}
                  value={filters.body_type}
                  onChange={(value) => setFilter('body_type', value as BodyType[])}
                  columns={2}
                />
              </FilterSection>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Fuel & Transmission */}
            <div ref={el => scrollRefs.current['fuel-transmission'] = el}>
              <FilterSection title="Fuel & Transmission" sectionId="fuel-transmission" defaultOpen>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Fuel Type</Label>
                    <div className="mt-2">
                      <CheckboxGroup
                        options={Object.values(FuelType)}
                        value={filters.fuel_type}
                        onChange={(value) => setFilter('fuel_type', value as FuelType[])}
                        columns={2}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Transmission</Label>
                    <div className="mt-2">
                      <CheckboxGroup
                        options={Object.values(TransmissionType)}
                        value={filters.transmission}
                        onChange={(value) => setFilter('transmission', value as TransmissionType[])}
                        columns={2}
                      />
                    </div>
                  </div>
                </div>
              </FilterSection>
            </div>

            {/* Engine & Details */}
            <FilterSection title="Engine & Details">
              <div className="space-y-4">
                <RangeSlider
                  label="Engine Size (L)"
                  value={filters.engine_size}
                  onChange={(value) => setFilter('engine_size', value)}
                  min={0}
                  max={6}
                  step={0.1}
                  formatter={(value) => `${value}L`}
                />
                <div>
                  <Label className="text-sm font-medium">Doors</Label>
                  <div className="mt-2">
                    <CheckboxGroup
                      options={['2', '3', '4', '5', '6+']}
                      value={filters.doors.map(String)}
                      onChange={(value) => setFilter('doors', value.map(Number))}
                      columns={3}
                    />
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Seller & Condition */}
            <FilterSection title="Seller & Condition">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Seller Type</Label>
                  <div className="mt-2">
                    <CheckboxGroup
                      options={Object.values(SellerType)}
                      value={filters.seller_type}
                      onChange={(value) => setFilter('seller_type', value as SellerType[])}
                      columns={2}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Condition</Label>
                  <div className="mt-2">
                    <CheckboxGroup
                      options={Object.values(VehicleCondition)}
                      value={filters.condition}
                      onChange={(value) => setFilter('condition', value as VehicleCondition[])}
                      columns={2}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Import Status</Label>
                  <div className="mt-2">
                    <CheckboxGroup
                      options={Object.values(ImportStatus)}
                      value={filters.import_status}
                      onChange={(value) => setFilter('import_status', value as ImportStatus[])}
                      columns={1}
                    />
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Location */}
            <div ref={el => scrollRefs.current['location'] = el}>
              <FilterSection title="Location" sectionId="location">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter city, postcode, or area"
                      value={filters.location}
                      onChange={(e) => setFilter('location', e.target.value)}
                    />
                  </div>
                  <RangeSlider
                    label="Previous Owners"
                    value={filters.ownership_history}
                    onChange={(value) => setFilter('ownership_history', value)}
                    min={1}
                    max={10}
                  />
                </div>
              </FilterSection>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Sample Vehicle Card Component
const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
      <Car className="h-12 w-12 text-gray-400" />
    </div>
    <h3 className="font-semibold text-lg">{vehicle.title}</h3>
    <p className="text-gray-600">{vehicle.year} • {vehicle.mileage.toLocaleString()} miles</p>
    <p className="text-xl font-bold text-blue-600 mt-2">£{vehicle.price.toLocaleString()}</p>
    <p className="text-sm text-gray-500 mt-1">{vehicle.location}</p>
  </div>
);

// Main Component
const VehicleFilterSystem: React.FC = () => {
  const activeFiltersCount = useVehicleFilters(state => state.getActiveFiltersCount());
  const [scrollToSection, setScrollToSection] = useState<(sectionId: string) => void>(() => () => {});

  // Sample vehicles data
  const sampleVehicles = [
    {
      title: "2020 Toyota Camry SE",
      year: 2020,
      price: 22500,
      mileage: 35000,
      location: "London, UK"
    },
    {
      title: "2019 BMW 3 Series",
      year: 2019,
      price: 28900,
      mileage: 42000,
      location: "Manchester, UK"
    },
    {
      title: "2021 Honda CR-V",
      year: 2021,
      price: 26750,
      mileage: 28000,
      location: "Birmingham, UK"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Vehicle</h1>
        
        {/* Quick Filters */}
        <QuickFilters 
          onOpenAdvanced={() => {}}
          scrollToSection={scrollToSection}
        />
        
        {/* Filter Pills */}
        <FilterPills />
        
        {/* Advanced Filters Button */}
        <div className="flex items-center gap-4 mb-6">
          <AdvancedFiltersModal onScrollToSection={setScrollToSection}>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Advanced Filters
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </AdvancedFiltersModal>
          
          <Button className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Vehicles
          </Button>
        </div>
      </div>

      {/* Vehicle Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleVehicles.map((vehicle, index) => (
          <VehicleCard key={index} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default VehicleFilterSystem;
