# API Setup Documentation

This project uses **Axios** for HTTP requests and **TanStack React Query** for data fetching, caching, and state management.

## 🚀 Quick Start

### Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Configure your API endpoints in `.env.local`:
   ```env
   # Use local API during development
   NEXT_PUBLIC_USE_LOCAL_API=true
   
   # API URLs for different environments
   NEXT_PUBLIC_LOCAL_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_DEV_API_URL=https://dev-api.caro.lk/api/v1
   NEXT_PUBLIC_STAGING_API_URL=https://staging-api.caro.lk/api/v1
   NEXT_PUBLIC_PROD_API_URL=https://api.caro.lk/api/v1
   ```

### Switching Between Environments

#### Option 1: Using Environment Variables
```env
# For local development
NEXT_PUBLIC_USE_LOCAL_API=true

# For staging
NEXT_PUBLIC_USE_LOCAL_API=false
NEXT_PUBLIC_ENVIRONMENT=staging

# For production
NEXT_PUBLIC_USE_LOCAL_API=false
NEXT_PUBLIC_ENVIRONMENT=production
```

#### Option 2: Complete Override
```env
# Override all environment logic
NEXT_PUBLIC_API_URL=http://your-custom-api.com/api/v1
```

## 📁 Project Structure

```
src/lib/
├── api/
│   ├── index.ts          # Main exports
│   ├── config.ts         # API configuration & endpoints
│   ├── client.ts         # Axios instance with interceptors
│   └── vehicleApi.ts     # Vehicle-specific API functions
├── hooks/
│   └── useVehicles.ts    # React Query hooks
├── providers/
│   └── ReactQueryProvider.tsx  # React Query setup
└── examples/
    └── ReactQueryUsage.tsx     # Usage examples
```

## 🔧 Usage Examples

### 1. Fetching Vehicle Data

```tsx
import { useVehicleById } from '@/lib/hooks/useVehicles';

export const CarDetails = ({ carId }: { carId: string }) => {
  const { data, isLoading, error } = useVehicleById(carId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Vehicle not found</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>Price: LKR {data.price.toLocaleString()}</p>
    </div>
  );
};
```

### 2. Search & Filters

```tsx
import { useMakes, useModels, useVehicles } from '@/lib/hooks/useVehicles';

export const VehicleSearch = () => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minPrice: 0,
    maxPrice: 10000000,
  });

  const { data: makes } = useMakes();
  const { data: models } = useModels(filters.make);
  const { data: vehicles, refetch } = useVehicles(filters, {
    enabled: false // Manual search
  });

  return (
    <div>
      {/* Filter UI */}
      <select onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}>
        {makes?.map(make => (
          <option key={make.name} value={make.name}>{make.name}</option>
        ))}
      </select>

      <button onClick={() => refetch()}>Search</button>

      {/* Results */}
      {vehicles?.vehicles.map(vehicle => (
        <div key={vehicle.id}>{vehicle.title}</div>
      ))}
    </div>
  );
};
```

### 3. Direct API Calls

```tsx
import { vehicleApi } from '@/lib/api';

// Direct API usage (without React Query)
const fetchVehicle = async (id: string) => {
  try {
    const vehicle = await vehicleApi.getVehicleById(id);
    console.log(vehicle);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 🛠️ Available Hooks

### Vehicle Hooks
- `useVehicles(params?, options?)` - Get vehicles with optional filters
- `useVehicleById(id, options?)` - Get single vehicle by ID
- `useVehicleSearch(params, options?)` - Search vehicles with advanced filters

### Filter Data Hooks
- `useMakes(options?)` - Get available makes
- `useModels(make, options?)` - Get models for a specific make
- `useLocations(options?)` - Get available locations

### Mutation Hooks (Future)
- `useCreateVehicle()` - Create new vehicle
- `useUpdateVehicle()` - Update vehicle
- `useDeleteVehicle()` - Delete vehicle

## ⚙️ Configuration Options

### Query Options
All hooks accept standard React Query options:
```tsx
const { data } = useVehicles(params, {
  staleTime: 5 * 60 * 1000,     // 5 minutes
  gcTime: 10 * 60 * 1000,       // 10 minutes
  refetchOnWindowFocus: false,   // Don't refetch on focus
  enabled: false,                // Manual fetching
});
```

### Axios Configuration
The axios client includes:
- **Base URL**: Automatically configured based on environment
- **Timeout**: 10 seconds default
- **Auth**: Automatic token injection from localStorage
- **Interceptors**: Request/response logging and error handling
- **Retry Logic**: Automatic retry for network errors

## 🔄 Environment Switching

### Development
```bash
# Use local backend
NEXT_PUBLIC_USE_LOCAL_API=true

# Use staging backend
NEXT_PUBLIC_USE_LOCAL_API=false
```

### Production Build
```bash
# Staging
NEXT_PUBLIC_ENVIRONMENT=staging

# Production
NEXT_PUBLIC_ENVIRONMENT=production
```

## 📋 API Endpoints

The following endpoints are configured:

```typescript
// Vehicle endpoints
GET    /vehicles              # List vehicles
GET    /vehicles/:id          # Get vehicle by ID
POST   /vehicles/search       # Search vehicles

// Filter endpoints
GET    /vehicles/makes         # Get available makes
GET    /vehicles/makes/:make/models  # Get models for make
GET    /locations             # Get locations

// Future endpoints
POST   /vehicles              # Create vehicle
PUT    /vehicles/:id          # Update vehicle
DELETE /vehicles/:id          # Delete vehicle
```

## 🐛 Debugging

### Check Current API URL
```tsx
import { getBaseURL } from '@/lib/api/config';
console.log('Current API URL:', getBaseURL());
```

### Enable Request Logging
Requests are automatically logged in development mode. Check browser console for:
- 🚀 API Request logs
- ✅ API Response logs  
- ❌ API Error logs

### React Query Devtools
The React Query DevTools are automatically enabled in development:
- Press F12 to open DevTools
- Look for the React Query panel
- Inspect queries, mutations, and cache

## 🔐 Authentication

The axios client automatically handles JWT tokens:
```typescript
// Token is automatically added to headers if present
localStorage.setItem('authToken', 'your-jwt-token');

// Token is automatically removed on 401 errors
// Implement redirect logic in client.ts
```

## 📝 TypeScript Support

All API functions and hooks are fully typed:
```typescript
import type { VehicleResponse, VehicleSearchParams } from '@/lib/api';

const searchParams: VehicleSearchParams = {
  make: 'BMW',
  minPrice: 1000000,
  maxPrice: 5000000,
};
```

---

## 🎯 Next Steps

1. **Replace Mock Data**: Update components to use React Query hooks instead of mock data
2. **Add Authentication**: Implement login/logout and token management
3. **Error Handling**: Add proper error boundaries and user-friendly error messages
4. **Loading States**: Implement skeleton loaders and loading indicators
5. **Caching Strategy**: Fine-tune cache times based on data freshness requirements
