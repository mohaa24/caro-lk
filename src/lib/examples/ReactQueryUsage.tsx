// Example of how to use React Query in components
// This shows how you would integrate the API calls in your components

import { useVehicleById, useMakes, useModels, useLocations } from '@/lib/hooks/useVehicles';

// Example 1: Using in CarDetails component
export const CarDetailsWithAPI = ({ carId }: { carId: string }) => {
  // Fetch vehicle data using React Query
  const { 
    data: vehicleData, 
    isLoading, 
    error, 
    isError 
  } = useVehicleById(carId);

  // Handle loading state
  if (isLoading) {
    return <div>Loading vehicle details...</div>;
  }

  // Handle error state
  if (isError) {
    return <div>Error loading vehicle: {error?.message}</div>;
  }

  // Handle no data
  if (!vehicleData) {
    return <div>Vehicle not found</div>;
  }

  // Render component with real data
  return (
    <div>
      <h1>{vehicleData.title}</h1>
      <p>Price: LKR {vehicleData.price.toLocaleString()}</p>
      <p>Make: {vehicleData.make}</p>
      <p>Model: {vehicleData.model}</p>
      {/* ... rest of your component */}
    </div>
  );
};

// Example 2: Using in Search/Filter components
export const VehicleFilters = () => {
  const [selectedMake, setSelectedMake] = useState('');

  // Fetch makes data
  const { data: makes, isLoading: makesLoading } = useMakes();
  
  // Fetch models based on selected make
  const { data: models, isLoading: modelsLoading } = useModels(selectedMake, {
    enabled: !!selectedMake, // Only fetch if make is selected
  });

  // Fetch locations
  const { data: locations } = useLocations();

  return (
    <div>
      {/* Make selector */}
      <select 
        value={selectedMake} 
        onChange={(e) => setSelectedMake(e.target.value)}
        disabled={makesLoading}
      >
        <option value="">Select Make</option>
        {makes?.map((make) => (
          <option key={make.name} value={make.name}>
            {make.name} ({make.count})
          </option>
        ))}
      </select>

      {/* Model selector */}
      <select disabled={!selectedMake || modelsLoading}>
        <option value="">Select Model</option>
        {models?.map((model) => (
          <option key={model.name} value={model.name}>
            {model.name} ({model.count})
          </option>
        ))}
      </select>

      {/* Location selector */}
      <select>
        <option value="">Select Location</option>
        {locations?.map((location) => (
          <option key={location.name} value={location.name}>
            {location.name} ({location.count})
          </option>
        ))}
      </select>
    </div>
  );
};

// Example 3: Using with search parameters
export const VehicleSearch = () => {
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    minPrice: 0,
    maxPrice: 10000000,
  });

  // Fetch vehicles with search parameters
  const { 
    data: searchResults, 
    isLoading, 
    refetch 
  } = useVehicles(searchParams, {
    enabled: false, // Don't fetch automatically, wait for user action
  });

  const handleSearch = () => {
    refetch(); // Manually trigger the search
  };

  return (
    <div>
      {/* Search form */}
      <input
        type="text"
        placeholder="Make"
        value={searchParams.make}
        onChange={(e) => setSearchParams(prev => ({ ...prev, make: e.target.value }))}
      />
      <input
        type="text"
        placeholder="Model"
        value={searchParams.model}
        onChange={(e) => setSearchParams(prev => ({ ...prev, model: e.target.value }))}
      />
      <input
        type="number"
        placeholder="Min Price"
        value={searchParams.minPrice}
        onChange={(e) => setSearchParams(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={searchParams.maxPrice}
        onChange={(e) => setSearchParams(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
      />
      
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>

      {/* Results */}
      {searchResults && (
        <div>
          <h3>Found {searchResults.total} vehicles</h3>
          {searchResults.vehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <h4>{vehicle.title}</h4>
              <p>LKR {vehicle.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/*
To integrate into your existing components:

1. Replace mock data fetching with React Query hooks:
   // Instead of:
   const carData = getMockCarData(carId);
   
   // Use:
   const { data: carData, isLoading, error } = useVehicleById(carId);

2. Add loading and error states:
   if (isLoading) return <LoadingSpinner />;
   if (error) return <ErrorMessage error={error} />;
   if (!carData) return <NotFound />;

3. For search/filter components, use the filter hooks:
   const { data: makes } = useMakes();
   const { data: models } = useModels(selectedMake);
   const { data: vehicles } = useVehicles(searchFilters);

4. For forms that create/update vehicles:
   const createVehicleMutation = useCreateVehicle();
   const updateVehicleMutation = useUpdateVehicle();
   
   const handleSubmit = async (formData) => {
     try {
       await createVehicleMutation.mutateAsync(formData);
       // Handle success
     } catch (error) {
       // Handle error
     }
   };
*/
