'use client';

import React, { useState } from 'react';
// import { useParams } from 'next/navigation'; // TODO: Uncomment when connecting to API
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  MapPin, 
  Phone, 
  Globe, 
  Mail, 
  Clock, 
  Car,
  Users,
  Award,
  Shield,
  Heart,
  Share,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Mock data - you can replace this with API calls later
const mockDealerData = {
  id: 1,
  business_name: "Vertu Ford Crewe",
  contact_person: "John Smith",
  phone: "+44 1270 123456",
  email: "info@vertufordcrewe.co.uk",
  website: "https://www.vertufordcrewe.co.uk",
  address: "Gateway Retail Park, Crewe Road",
  city: "Crewe",
  province: "Cheshire",
  postal_code: "CW1 6BD",
  description: "At Vertu Ford Crewe, we pride ourselves on delivering exceptional customer service and offering a comprehensive range of new and used Ford vehicles. Our experienced team is here to help you find the perfect car for your needs.",
  rating: 4.7,
  reviews_count: 342,
  established_year: 2005,
  staff_count: 15,
  specializations: ["New Ford Vehicles", "Used Cars", "Service & Maintenance", "Parts & Accessories"],
  opening_hours: {
    monday: "8:30 AM - 6:00 PM",
    tuesday: "8:30 AM - 6:00 PM",
    wednesday: "8:30 AM - 6:00 PM",
    thursday: "8:30 AM - 6:00 PM",
    friday: "8:30 AM - 6:00 PM",
    saturday: "8:30 AM - 5:00 PM",
    sunday: "10:00 AM - 4:00 PM"
  },
  services: [
    "New Vehicle Sales",
    "Used Vehicle Sales", 
    "Vehicle Servicing",
    "MOT Testing",
    "Genuine Ford Parts",
    "Ford Warranty",
    "Finance Options",
    "Part Exchange"
  ],
  awards: [
    "Ford Customer Excellence Award 2023",
    "Best Customer Service 2022",
    "Dealer of the Year 2021"
  ],
  image_url: "/newCar.png", // Using existing image
  gallery_images: [
    "/newCar.png",
    "/newCar.png", 
    "/newCar.png",
    "/newCar.png"
  ]
};

const mockVehicles = [
  {
    id: 1,
    make: "Ford",
    model: "Focus",
    year: 2023,
    price: 18500,
    mileage: 12000,
    fuel_type: "Petrol",
    transmission: "Manual",
    image_url: "/newCar.png",
    condition: "Used"
  },
  {
    id: 2,
    make: "Ford",
    model: "Fiesta",
    year: 2024,
    price: 16200,
    mileage: 0,
    fuel_type: "Hybrid",
    transmission: "Automatic",
    image_url: "/newCar.png",
    condition: "New"
  },
  {
    id: 3,
    make: "Ford",
    model: "Puma",
    year: 2023,
    price: 22000,
    mileage: 8500,
    fuel_type: "Petrol",
    transmission: "Manual",
    image_url: "/newCar.png",
    condition: "Used"
  }
];

export default function DealerDetailsPage() {
  // const params = useParams(); 
  // const dealerId = params.dealerId as string; // TODO: Use this when connecting to API
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const dealer = mockDealerData; // In real app, fetch based on dealerId
  const vehicles = mockVehicles; // In real app, fetch dealer's vehicles

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dealer Image */}
            <div className="lg:col-span-1">
              <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden">
                <Image
                  src={dealer.image_url}
                  alt={dealer.business_name}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Gallery thumbnails */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {dealer.gallery_images.slice(0, 4).map((img, index) => (
                  <div key={index} className="relative h-16 rounded overflow-hidden">
                    <Image
                      src={img}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dealer Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{dealer.business_name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(dealer.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-lg font-semibold">{dealer.rating}</span>
                    <span className="ml-1 text-gray-600">({dealer.reviews_count} reviews)</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3" />
                  <span>{dealer.address}, {dealer.city}, {dealer.province} {dealer.postal_code}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3" />
                  <span>{dealer.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="h-5 w-5 mr-3" />
                  <a href={dealer.website} className="text-blue-600 hover:underline">
                    {dealer.website}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3" />
                  <span>{dealer.email}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{vehicles.length}</div>
                  <div className="text-sm text-gray-600">Vehicles</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{dealer.staff_count}</div>
                  <div className="text-sm text-gray-600">Staff Members</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{dealer.established_year}</div>
                  <div className="text-sm text-gray-600">Established</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Button className="flex-1 sm:flex-initial">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Dealer
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-initial">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Dealer
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-initial">
                  <MapPin className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
              {/* About Us Section */}
            <Card className=' border-none'>
              <CardHeader>
                <CardTitle className="text-2xl">About Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  {dealer.description}
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Our Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {dealer.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Services We Offer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {dealer.services.map((service, index) => (
                      <div key={index} className="flex items-center">
                        <Shield className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Awards & Recognition</h3>
                  <div className="space-y-2">
                    {dealer.awards.map((award, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="h-4 w-4 text-yellow-600 mr-2" />
                        <span className="text-gray-700">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Vehicles Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Vehicles ({vehicles.length})</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                    <div className="flex border rounded-md">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className="rounded-r-none"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className="rounded-l-none"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter Panel */}
                {showFilters && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price Range
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option>Any Price</option>
                          <option>Under £15,000</option>
                          <option>£15,000 - £20,000</option>
                          <option>£20,000 - £25,000</option>
                          <option>Over £25,000</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fuel Type
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option>Any Fuel</option>
                          <option>Petrol</option>
                          <option>Diesel</option>
                          <option>Electric</option>
                          <option>Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Transmission
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option>Any</option>
                          <option>Manual</option>
                          <option>Automatic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Condition
                        </label>
                        <select className="w-full p-2 border border-gray-300 rounded-md">
                          <option>Any</option>
                          <option>New</option>
                          <option>Used</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vehicles Grid */}
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1'
                }`}>
                  {vehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className={`${viewMode === 'grid' ? 'block' : 'flex'}`}>
                        <div className={`relative ${
                          viewMode === 'grid' 
                            ? 'h-48 w-full' 
                            : 'h-32 w-48 flex-shrink-0'
                        }`}>
                          <Image
                            src={vehicle.image_url}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            fill
                            className="object-cover"
                          />
                          <Badge 
                            className="absolute top-2 left-2"
                            variant={vehicle.condition === 'New' ? 'default' : 'secondary'}
                          >
                            {vehicle.condition}
                          </Badge>
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <p className="text-2xl font-bold text-blue-600 mt-2">
                            £{vehicle.price.toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                            <span>{vehicle.mileage.toLocaleString()} miles</span>
                            <span>{vehicle.fuel_type}</span>
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Link 
                              href={`/vehicle/${vehicle.id}`}
                              className="text-blue-600 hover:underline font-medium"
                            >
                              View Details
                            </Link>
                            <Button size="sm">
                              Contact Dealer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opening Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Opening Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(dealer.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}</span>
                      <span className="text-gray-600">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
