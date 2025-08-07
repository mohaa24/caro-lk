
import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Gauge, Fuel, Users, Star, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useVehiclesPublic } from '@/lib/hooks/useVehicles';
import { useVehicleFilters } from '@/app/store/filtersSlice';
import { convertFiltersToSearchParams } from '@/lib/utils/filterUtils';
import type { VehicleResponse } from '@/app/Types/CommonTypes';

const VehicleCard = ({ vehicle }: { vehicle: VehicleResponse }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Handle case where vehicle might not have images
  const vehicleImages = vehicle.images && vehicle.images.length > 0
    ? vehicle.images.map(img => img.url)
    : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop']; // placeholder image

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === vehicleImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {

    setCurrentImageIndex((prev) =>
      prev === 0 ? vehicleImages.length - 1 : prev - 1
    );
  };

  return (
    <Link href={`/vehicle/${vehicle.id}`} className=''>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0 gap-3 h-full">
        {/* Image Section */}
        <div className="relative h-48 bg-muted">
          <img
            src={vehicleImages[currentImageIndex]}
            alt={vehicle.make + ' ' + vehicle.model}
            className="w-full h-full object-cover"
          />

          {/* Image Navigation */}
          {vehicleImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => { prevImage(); e.stopPropagation(); e.preventDefault() }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-none"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => { nextImage(); e.stopPropagation(); e.preventDefault() }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-none"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Image Indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {vehicleImages.map((_, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Like Button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => { setIsLiked(!isLiked); e.stopPropagation(); e.preventDefault() }}
            className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white border-none"
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
          </Button>

          {/* Price Badge */}
          {/* <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {vehicle.price}
        </Badge> */}
        </div>

        <CardHeader className="pb-0">
          {/* Title and Rating */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold leading-tight line-clamp-1">
              {vehicle.make} {vehicle.model} {vehicle.year}
            </h3>
            <div className="flex items-center space-x-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-muted-foreground">
                {/* Rating not available in search results - would need separate API call */}
                {'N/A'}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex flex-col justify-between h-full">
          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{vehicle.year}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Gauge className="h-4 w-4" />
              <span>{vehicle.mileage} km</span>
            </div>
            <div className="flex items-center space-x-1">
              <Fuel className="h-4 w-4" />
              <span>{vehicle.fuel_type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
               <span>{vehicle.location}</span>
            </div>
            <div className="flex items-center space-x-1">
                <Info className="h-4 w-4" />
               <span>{'Used'}</span>
            </div>
          </div>

          {/* Location and Dealer */}
       
          {/* Description */}
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {vehicle.description}
          </p>

          {/* Features */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {vehicle?.features?.slice(0, 3).map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {vehicle?.features?.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{vehicle?.features?.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className=' font-bold w-full flex justify-end'>
            LKR {vehicle.price.toLocaleString()}
          </div>
        </CardContent>

        <CardFooter className="hidden pt-0">
          {/* Action Buttons */}
          <div className="flex space-x-2 w-full">
            {/* <Button className="flex-1">
            View Details
          </Button> */}
            {/* <Button variant="outline" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail className="h-4 w-4" />
          </Button> */}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

const VehicleViewer = () => {
  const [viewMode] = useState('grid'); // 'grid' or 'list'

  // Get current filters from the store
  const { filters } = useVehicleFilters();

  // Convert filters to search parameters
  const searchParams = convertFiltersToSearchParams(filters);

  // Use the API hook to fetch vehicles with filters
  const { data: vehicles, isLoading, error } = useVehiclesPublic(searchParams);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-5 md:px-0">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading vehicles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-5 md:px-0">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-600">Error loading vehicles: {String(error)}</div>
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    const hasFilters = Object.keys(searchParams).length > 0;

    return (
      <div className="max-w-7xl mx-auto px-5 md:px-0">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <div className="text-gray-600 text-center">
            {hasFilters ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No vehicles found with current filters</h3>
                <p className="text-sm">Try adjusting your search criteria to see more results.</p>
              </>
            ) : (
              'No vehicles found'
            )}
          </div>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => useVehicleFilters.getState().clearAllFilters()}
              className="mt-4"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-0 mt-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-muted-foreground">
            {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} found
            {Object.keys(searchParams).length > 0 && ' with current filters'}
          </p>
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && Object.keys(searchParams).length > 0 && (
            <details className="mt-2">
              <summary className="text-xs text-gray-500 cursor-pointer">Active filters (debug)</summary>
              <pre className="text-xs text-gray-400 mt-1 bg-gray-100 p-2 rounded">
                {JSON.stringify(searchParams, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* View Toggle */}
        {/* <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <div className="flex">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
          </div>
        </div> */}
      </div>

      {/* Vehicle Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
          : 'grid-cols-1'
        }`}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg">
          Load More Vehicles
        </Button>
      </div>
    </div>
  );
};

export default VehicleViewer;