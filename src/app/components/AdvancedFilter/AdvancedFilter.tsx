import React, { useState, useRef, useEffect, ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
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
    CarIcon,
    Settings,
    Gauge,
    PoundSterling,
    Users,
    ShieldCheck,
    Truck,
    Globe,
    UserCheck,
    Wrench
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
import { DialogClose } from '@radix-ui/react-dialog';
import vehicleData from '@/data/vehicleData.json';
import locationData from '@/data/locationData.json';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { useVehicleFilters, VehicleFilters } from '@/app/store/filtersSlice';
import VehicleViewer from '../VehicleCard/VehicleCard';

// Filter Interfaces
interface FilterPill {
    key: string;
    label: string;
    parentKey?: keyof VehicleFilters;
    value?: string | number;
}

interface QuickFiltersProps {
    onOpenAdvanced: (sectionId?: string) => void;
}

interface FilterSectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    sectionId?: string;
    activeSection?: string | null;
    onSectionChange?: (sectionId: string | null) => void;
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
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
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

// Sample data from JSON file
const popularMakes = vehicleData.makes;

// Model data mapping from JSON file
const modelsByMake: Record<string, string[]> = vehicleData.modelsByMake;

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
            const currentValues = filters[pill.parentKey] as (string | number | VehicleType | FuelType | TransmissionType | BodyType | SellerType | ImportStatus | VehicleCondition)[];
            const newValues = currentValues.filter(item => item !== pill.value);
            useVehicleFilters.getState().setFilter(pill.parentKey, newValues as VehicleFilters[typeof pill.parentKey]);
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
const QuickFilters: React.FC<QuickFiltersProps> = ({ onOpenAdvanced }) => {
    const { filters } = useVehicleFilters();

    const quickFilterButtons = [
        {
            label: 'Make & Model',
            icon: Car,
            section: 'make-model',
            hasValue: filters.make !== '' || filters.model !== ''
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
            section: 'fuel-type',
            hasValue: filters.fuel_type.length > 0
        },
        {
            label: 'Year',
            icon: Calendar,
            section: 'year',
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
                        onOpenAdvanced(button.section);
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

// Function to get icon for each filter section
const getSectionIcon = (sectionId?: string) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        'vehicle-type': Car,
        'make-model': CarIcon,
        'year': Calendar,
        'price': PoundSterling,
        'mileage': Gauge,
        'body-type': Truck,
        'fuel-type': Fuel,
        'transmission': Settings,
        'engine-size': Wrench,
        'doors': Car,
        'seller-type': UserCheck,
        'condition': ShieldCheck,
        'import-status': Globe,
        'location': MapPin,
        'owners': Users,
    };

    return iconMap[sectionId || ''] || Car;
};

// Collapsible Filter Section Component
const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    children,
    defaultOpen = false,
    sectionId,
    activeSection,
    onSectionChange
}) => {
    // Determine if this section should be open
    const isOpen = activeSection ? activeSection === sectionId : defaultOpen;

    // Get the appropriate icon for this section
    const IconComponent = getSectionIcon(sectionId);

    const handleToggle = (newOpen: boolean) => {
        if (onSectionChange && sectionId) {
            // If opening this section, close others; if closing, set to null
            onSectionChange(newOpen ? sectionId : null);
        }
    };

    return (
        <div id={sectionId} className="border-b border-gray-200 py-4">
            <Collapsible open={isOpen} onOpenChange={handleToggle}>
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex w-full justify-between p-0 font-semibold text-left hover:bg-transparent"
                    >
                        <span className='flex gap-3 items-center'>
                            <span>
                                <IconComponent className="h-4 w-4" />
                            </span>
                            {title}
                        </span>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-3">
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
const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({
    children,
    onScrollToSection,
    isOpen,
    onOpenChange
}) => {
    const { filters, setFilter, getActiveFiltersCount, clearAllFilters } = useVehicleFilters();
    const [activeSection, setActiveSection] = useState<string | null>('vehicle-type'); // Default to vehicle-type being open
    const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const scrollToSection = (sectionId: string) => {
        // Set the active section to the target one (this will close others and open the target)
        setActiveSection(sectionId);

        // Scroll to it with a small delay to allow the section to open
        setTimeout(() => {
            const element = scrollRefs.current[sectionId];
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    useEffect(() => {
        onScrollToSection(scrollToSection);
    }, [onScrollToSection]);

    const formatPrice = (price: number) => `LKR${price.toLocaleString()}`;
    const formatMileage = (mileage: number) => `${mileage.toLocaleString()} km`;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] [&>button]:hidden [&>[data-radix-dialog-close]]:hidden flex flex-col overflow-hidden">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="flex items-center justify-between">
                        <div className='flex w-full justify-start gap-3'>
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5" />
                                Advanced Filters
                            </span>
                            <div className={`flex items-center gap-2 ${getActiveFiltersCount() === 0 && 'hidden'}`}>
                                <Badge variant="outline">{getActiveFiltersCount()} active</Badge>
                            </div></div>

                        <DialogClose><button> <X /> </button></DialogClose>
                    </DialogTitle>

                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-1 p-1">
                        {/* Vehicle Type */}
                        <div ref={el => { scrollRefs.current['vehicle-type'] = el; }}>
                            <FilterSection
                                title="Vehicle Type"
                                sectionId="vehicle-type"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={Object.values(VehicleType)}
                                    value={filters.vehicle_type}
                                    onChange={(value) => setFilter('vehicle_type', value as VehicleType[])}
                                    columns={2}
                                />
                            </FilterSection>
                        </div>

                        {/* Make & Model */}
                        <div ref={el => { scrollRefs.current['make-model'] = el; }}>
                            <FilterSection
                                title="Make & Model"
                                sectionId="make-model"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <div className="space-y-4">
                                    <div className='space-y-3'>
                                        <Label>Make</Label>
                                        <SearchableSelect
                                            options={popularMakes}
                                            value={filters.make}
                                            onValueChange={(value) => {
                                                setFilter('make', value);
                                                // Clear model when make changes
                                                setFilter('model', '');
                                            }}
                                            placeholder="Select make"
                                            searchPlaceholder="Search makes..."
                                        />
                                        {filters.make && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {filters.make}
                                                    <button
                                                        onClick={() => {
                                                            setFilter('make', '');
                                                            setFilter('model', '');
                                                        }}
                                                        className="ml-1"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <div className='space-y-3'>
                                        <Label>Model</Label>
                                        <SearchableSelect
                                            options={filters.make ? modelsByMake[filters.make] || [] : []}
                                            value={filters.model}
                                            onValueChange={(value) => setFilter('model', value)}
                                            placeholder={filters.make ? "Select model" : "Select make first"}
                                            searchPlaceholder="Search models..."
                                            disabled={!filters.make}
                                            emptyMessage={filters.make ? "No models found" : "Select make first"}
                                        />
                                        {filters.model && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {filters.model}
                                                    <button
                                                        onClick={() => setFilter('model', '')}
                                                        className="ml-1"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <div className='space-y-3'>
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

                        {/* Year */}
                        <div ref={el => { scrollRefs.current['year'] = el; }}>
                            <FilterSection
                                title="Year"
                                sectionId="year"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <RangeSlider
                                    label="Year"
                                    value={filters.yearRange}
                                    onChange={(value) => setFilter('yearRange', value)}
                                    min={1990}
                                    max={2024}
                                />
                            </FilterSection>
                        </div>

                        {/* Price */}
                        <div ref={el => { scrollRefs.current['price'] = el; }}>
                            <FilterSection
                                title="Price"
                                sectionId="price"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <RangeSlider
                                    label="Price"
                                    value={filters.priceRange}
                                    onChange={(value) => setFilter('priceRange', value)}
                                    min={0}
                                    max={100000}
                                    step={1000}
                                    formatter={formatPrice}
                                />
                            </FilterSection>
                        </div>

                        {/* Mileage */}
                        <div ref={el => { scrollRefs.current['mileage'] = el; }}>
                            <FilterSection
                                title="Mileage"
                                sectionId="mileage"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <RangeSlider
                                    label="Mileage"
                                    value={filters.mileageRange}
                                    onChange={(value) => setFilter('mileageRange', value)}
                                    min={0}
                                    max={200000}
                                    step={1000}
                                    formatter={formatMileage}
                                />
                            </FilterSection>
                        </div>

                        {/* Body Type */}
                        <div ref={el => { scrollRefs.current['body-type'] = el; }}>
                            <FilterSection
                                title="Body Type"
                                sectionId="body-type"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={Object.values(BodyType)}
                                    value={filters.body_type}
                                    onChange={(value) => setFilter('body_type', value as BodyType[])}
                                    columns={2}
                                />
                            </FilterSection>
                        </div>

                        {/* Fuel Type */}
                        <div ref={el => { scrollRefs.current['fuel-type'] = el; }}>
                            <FilterSection
                                title="Fuel Type"
                                sectionId="fuel-type"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={Object.values(FuelType)}
                                    value={filters.fuel_type}
                                    onChange={(value) => setFilter('fuel_type', value as FuelType[])}
                                    columns={2}
                                />
                            </FilterSection>
                        </div>

                        {/* Transmission */}
                        <div ref={el => { scrollRefs.current['transmission'] = el; }}>
                            <FilterSection
                                title="Transmission"
                                sectionId="transmission"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={Object.values(TransmissionType)}
                                    value={filters.transmission}
                                    onChange={(value) => setFilter('transmission', value as TransmissionType[])}
                                    columns={2}
                                />
                            </FilterSection>
                        </div>

                        {/* Engine Size */}
                        <div ref={el => { scrollRefs.current['engine-size'] = el; }}>
                            <FilterSection
                                title="Engine Size"
                                sectionId="engine-size"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <RangeSlider
                                    label="Engine Size (L)"
                                    value={filters.engine_size}
                                    onChange={(value) => setFilter('engine_size', value)}
                                    min={0}
                                    max={6}
                                    step={0.1}
                                    formatter={(value) => `${value}L`}
                                />
                            </FilterSection>
                        </div>

                        {/* Doors */}
                        <div ref={el => { scrollRefs.current['doors'] = el; }}>
                            <FilterSection
                                title="Doors"
                                sectionId="doors"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={['2', '3', '4', '5', '6+']}
                                    value={filters.doors.map(String)}
                                    onChange={(value) => setFilter('doors', value.map(Number))}
                                    columns={3}
                                />
                            </FilterSection>
                        </div>

                        {/* Seller Type */}
                        <div ref={el => { scrollRefs.current['seller-type'] = el; }}>
                            <FilterSection
                                title="Seller Type"
                                sectionId="seller-type"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={Object.values(SellerType)}
                                    value={filters.seller_type}
                                    onChange={(value) => setFilter('seller_type', value as SellerType[])}
                                    columns={2}
                                />
                            </FilterSection>
                        </div>

                        {/* Vehicle Condition */}
                        <div ref={el => { scrollRefs.current['condition'] = el; }}>
                            <FilterSection
                                title="Vehicle Condition"
                                sectionId="condition"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={Object.values(VehicleCondition)}
                                    value={filters.condition}
                                    onChange={(value) => setFilter('condition', value as VehicleCondition[])}
                                    columns={2}
                                />
                            </FilterSection>
                        </div>

                        {/* Import Status */}
                        <div ref={el => { scrollRefs.current['import-status'] = el; }}>
                            <FilterSection
                                title="Import Status"
                                sectionId="import-status"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <CheckboxGroup
                                    options={Object.values(ImportStatus)}
                                    value={filters.import_status}
                                    onChange={(value) => setFilter('import_status', value as ImportStatus[])}
                                    columns={1}
                                />
                            </FilterSection>
                        </div>

                        {/* Location */}
                        <div ref={el => { scrollRefs.current['location'] = el; }}>
                            <FilterSection
                                title="Location"
                                sectionId="location"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <div className="space-y-3">
                                    <SearchableSelect
                                        options={[
                                            ...locationData.popularCities,
                                            ...Object.keys(locationData.locationsByDistrict).flatMap(district =>
                                                locationData.locationsByDistrict[district as keyof typeof locationData.locationsByDistrict]
                                            )
                                        ].filter((location, index, array) => array.indexOf(location) === index).sort()}
                                        value={filters.location}
                                        onValueChange={(value) => setFilter('location', value)}
                                        placeholder="Enter city, postcode, or area"
                                        searchPlaceholder="Search locations..."
                                        emptyMessage="No locations found"
                                    />
                                </div>
                            </FilterSection>
                        </div>

                        {/* Previous Owners */}
                        <div ref={el => { scrollRefs.current['owners'] = el; }}>
                            <FilterSection
                                title="Previous Owners"
                                sectionId="owners"
                                activeSection={activeSection}
                                onSectionChange={setActiveSection}
                            >
                                <RangeSlider
                                    label="Previous Owners"
                                    value={filters.ownership_history}
                                    onChange={(value) => setFilter('ownership_history', value)}
                                    min={1}
                                    max={10}
                                />
                            </FilterSection>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogFooter>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="text-red-600 hover:text-red-700"
                        >
                            Clear All
                        </Button>        <Button>Search</Button>
                    </DialogFooter>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
};



// Main Component
const VehicleFilterSystem: React.FC = () => {
    const activeFiltersCount = useVehicleFilters(state => state.getActiveFiltersCount());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingScrollSection, setPendingScrollSection] = useState<string | null>(null);

    const handleOpenAdvanced = (sectionId?: string) => {
        setIsModalOpen(true);
        if (sectionId) {
            setPendingScrollSection(sectionId);
        }
    };

    const handleScrollToSectionSetup = (scrollFn: (sectionId: string) => void) => {
        // If there's a pending scroll, execute it
        if (pendingScrollSection) {
            setTimeout(() => {
                scrollFn(pendingScrollSection);
                setPendingScrollSection(null);
            }, 100);
        }
    };

   
    return (
        <>
        <div className="max-w-7xl mx-auto py-5 px-5">
            <div className="">
                <h1 className="text-3xl font-bold mb-6">Find Your Perfect Vehicle</h1>

                <div className='flex flex-col md:flex-row w-full justify-between'>   {/* Quick Filters */}
                    <QuickFilters
                        onOpenAdvanced={handleOpenAdvanced}
                    />
                    <Button
                        className="hidden md:flex items-center gap-2"
                        onClick={() => handleOpenAdvanced()}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Advanced Filters
                        {activeFiltersCount > 0 && (
                            <Badge variant="default" className="ml-2">
                                {activeFiltersCount}
                            </Badge>
                        )}
                    </Button></div>

                {/* Filter Pills */}
                <FilterPills />

                {/* Advanced Filters Button */}
                <div className="flex w-full items-center gap-4">
                    <AdvancedFiltersModal
                        onScrollToSection={handleScrollToSectionSetup}
                        isOpen={isModalOpen}
                        onOpenChange={setIsModalOpen}
                    >
                        <></>
                    </AdvancedFiltersModal>

                    {/* <Button className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Search Vehicles
                    </Button> */}
                </div>
            </div>

          
          
        </div>
            {/* Vehicle Results */}
           <VehicleViewer/>  
           </>
    );
};

export default VehicleFilterSystem;
