
import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Gauge, Fuel, Users, Phone, Mail, Star, ChevronLeft, ChevronRight, Grid3X3, List } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback } from '@/components/ui/avatar';

// Mock vehicle data - you'll replace this with real data
const mockVehicles = [
  {
    id: 1,
    title: "Toyota Prius 2018",
    price: "LKR 4,500,000",
    year: 2018,
    mileage: "45,000 km",
    fuelType: "Hybrid",
    transmission: "Automatic",
    location: "Colombo 05",
    dealer: "Prime Motors",
    rating: 4.8,
    images: [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549399736-2b34cadb8c7d?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1563720030-6b1b0e1a0d7a?w=800&h=600&fit=crop",


    ],
    features: ["Air Conditioning", "Power Steering", "Alloy Wheels", "GPS Navigation"],
    description: "Well-maintained Toyota Prius in excellent condition. Single owner, full service history.",
    contact: {
      phone: "+94 77 123 4567",
      email: "sales@primemotors.lk"
    }
  },
  {
    id: 2,
    title: "Honda Civic 2020",
    price: "LKR 6,200,000",
    year: 2020,
    mileage: "28,000 km",
    fuelType: "Petrol",
    transmission: "Manual",
    location: "Kandy",
    dealer: "Auto Central",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"
    ],
    features: ["Sunroof", "Leather Seats", "Backup Camera", "Bluetooth"],
    description: "Sporty Honda Civic with low mileage. Perfect for city driving.",
    contact: {
      phone: "+94 81 234 5678",
      email: "info@autocentral.lk"
    }
  },
  {
    id: 3,
    title: "Suzuki Alto 2019",
    price: "LKR 2,100,000",
    year: 2019,
    mileage: "52,000 km",
    fuelType: "Petrol",
    transmission: "Manual",
    location: "Galle",
    dealer: "Lanka Motors",
    rating: 4.5,
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop"
    ],
    features: ["Power Windows", "Central Locking", "USB Port"],
    description: "Economical and reliable Suzuki Alto. Great for first-time buyers.",
    contact: {
      phone: "+94 91 345 6789",
      email: "sales@lankamotors.lk"
    }
  },
  {
    id: 4,
    title: "BMW X3 2021",
    price: "LKR 12,500,000",
    year: 2021,
    mileage: "15,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Colombo 03",
    dealer: "Luxury Cars LK",
    rating: 5.0,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&h=600&fit=crop"
    ],
    features: ["Premium Sound", "Panoramic Sunroof", "Heated Seats", "Navigation"],
    description: "Luxury BMW X3 in pristine condition. Full warranty remaining.",
    contact: {
      phone: "+94 11 567 8901",
      email: "bmw@luxurycars.lk"
    }
  },
  {
    id: 5,
    title: "Nissan Leaf 2022",
    price: "LKR 8,900,000",
    year: 2022,
    mileage: "12,000 km",
    fuelType: "Electric",
    transmission: "Automatic",
    location: "Negombo",
    dealer: "Green Drive",
    rating: 4.7,
    images: [

          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&h=600&fit=crop",
    ],
    features: ["Fast Charging", "Regenerative Braking", "Eco Mode", "Smart Key"],
    description: "Eco-friendly electric vehicle with impressive range. Perfect for environmentally conscious drivers.",
    contact: {
      phone: "+94 31 456 7890",
      email: "info@greendrive.lk"
    }
  },
  {
    id: 6,
    title: "Mitsubishi Montero 2017",
    price: "LKR 7,800,000",
    year: 2017,
    mileage: "68,000 km",
    fuelType: "Diesel",
    transmission: "Automatic",
    location: "Matara",
    dealer: "Off Road Masters",
    rating: 4.6,
    images: [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop"
    ],
    features: ["4WD", "Roof Rails", "Tow Bar", "Diff Lock", "Hill Descent Control"],
    description: "Robust SUV perfect for Sri Lankan roads. Excellent for both city and off-road adventures.",
    contact: {
      phone: "+94 41 678 9012",
      email: "sales@offroadmasters.lk"
    }
  },
  {
    id: 7,
    title: "Perodua Axia 2020",
    price: "LKR 1,950,000",
    year: 2020,
    mileage: "35,000 km",
    fuelType: "Petrol",
    transmission: "Manual",
    location: "Kurunegala",
    dealer: "Budget Cars",
    rating: 4.3,
    images: [
      "https://images.unsplash.com/photo-1498887960847-2a5e46312788?w=800&h=600&fit=crop"
    ],
    features: ["Fuel Efficient", "Compact Design", "Easy Parking", "Low Maintenance"],
    description: "Affordable and reliable city car. Great fuel economy and perfect for daily commuting.",
    contact: {
      phone: "+94 37 789 0123",
      email: "info@budgetcars.lk"
    }
  },
  {
    id: 8,
    title: "Mercedes-Benz C-Class 2019",
    price: "LKR 9,500,000",
    year: 2019,
    mileage: "32,000 km",
    fuelType: "Petrol",
    transmission: "Automatic",
    location: "Colombo 07",
    dealer: "Elite Motors",
    rating: 4.9,
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop"
    ],
    features: ["AMB Interior", "Digital Display", "Adaptive Cruise", "Lane Assist", "Premium Audio"],
    description: "Luxury sedan with cutting-edge technology. Impeccable comfort and performance.",
    contact: {
      phone: "+94 11 890 1234",
      email: "mercedes@elitemotors.lk"
    }
  },
  {
    id: 9,
    title: "Tata Nano 2016",
    price: "LKR 950,000",
    year: 2016,
    mileage: "78,000 km",
    fuelType: "Petrol",
    transmission: "Manual",
    location: "Anuradhapura",
    dealer: "City Cars",
    rating: 4.0,
    images: [
              "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494976688731-30fc2c0b79a1?w=800&h=600&fit=crop"
    ],
    features: ["Compact Size", "Easy Maintenance", "Good Mileage"],
    description: "Ultra-compact car ideal for city driving. Very economical and easy to park anywhere.",
    contact: {
      phone: "+94 25 901 2345",
      email: "sales@citycars.lk"
    }
  }
];


const VehicleCard = ({ vehicle }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 pt-0">
      {/* Image Section */}
      <div className="relative h-48 bg-muted">
        <img
          src={vehicle.images[currentImageIndex]}
          alt={vehicle.title}
          className="w-full h-full object-cover"
        />
        
        {/* Image Navigation */}
        {vehicle.images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-none"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-none"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {vehicle.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
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
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white border-none"
        >
          <Heart 
            className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
          />
        </Button>

        {/* Price Badge */}
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
          {vehicle.price}
        </Badge>
      </div>

      <CardHeader className="pb-0">
        {/* Title and Rating */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold leading-tight line-clamp-1">
            {vehicle.title}
          </h3>
          <div className="flex items-center space-x-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-muted-foreground">{vehicle.rating}</span>
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
            <span>{vehicle.mileage}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-4 w-4" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Location and Dealer */}
 <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{vehicle.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback >
                <span className="text-xs bg-gray-700 text-white rounded-full p-1">{vehicle.dealer.split(' ').map(word => word[0]).join('').slice(0, 2)}</span>
              </AvatarFallback>
            </Avatar>
            <span className="text-primary font-medium">{vehicle.dealer}</span>
          </div>
        </div>
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {vehicle.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {vehicle.features.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{vehicle.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className=' font-bold w-full flex justify-end'>
            {vehicle.price}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Action Buttons */}
        <div className="flex space-x-2 w-full">
          <Button className="flex-1">
            View Details
          </Button>
          <Button variant="outline" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const VehicleViewer = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Used Cars for Sale</h1>
          <p className="text-muted-foreground">
            {mockVehicles.length} vehicles found
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-2">
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
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {mockVehicles.map((vehicle) => (
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