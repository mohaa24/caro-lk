'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    SellerType, 
    VehicleResponse, 
    VehicleType, 
    FuelType, 
    TransmissionType, 
    BodyType, 
    ImportStatus, 
    VehicleCondition 
} from '@/app/Types/CommonTypes';
import {
    Car,
    MapPin,
    Calendar,
    Fuel,
    Settings,
    Gauge,
    Users,
    Phone,
    Mail,
    Star,
    Heart,
    Share2,
    Shield,
    CheckCircle,
    Clock,
    Eye,
    Camera,
    User
} from 'lucide-react';

interface CarDetailsProps {
    carId: string;
}

// Extended interface for car details page - includes additional UI-specific data
interface CarDetailsData extends VehicleResponse {
    safetyFeatures: string[];
    dealer?: {
        name: string;
        rating: number;
        reviewCount: number;
        address: string;
        phone: string;
        email: string;
        logo?: string;
        verified: boolean;
    };
    privateSellerInfo?: {
        name: string;
        phone: string;
        email: string;
    };
    serviceHistory: {
        lastService: string;
        mot: string;
        motExpiry: string;
        taxExpiry: string;
    };
    financing: {
        monthlyPayment: number;
        deposit: number;
        term: number;
        apr: number;
    };
    specs: Record<string, string>;
    dateAdded: string;
    views: number;
}

// Mock data - in real app this would come from API
const getMockCarData = (id: string): CarDetailsData => ({
    // VehicleResponse base fields
    id: parseInt(id) || 1,
    posted_by_id: 123,
    vehicle_type: VehicleType.Car,
    title: "2022 BMW 3 Series 320d M Sport",
    make: "BMW",
    model: "3 Series",
    variant: "320d M Sport",
    year: 2022,
    price: 120500000,
    mileage: 15420,
    fuel_type: FuelType.Diesel,
    transmission: TransmissionType.Automatic,
    body_type: BodyType.Sedan,
    color: "Alpine White",
    engine_size: 2.0,
    doors: 4,
    registration_date: 2022,
    location: "London",
    seller_type: false ? SellerType.Private : SellerType.Dealer,
    import_status: ImportStatus.UsedImport,
    condition: VehicleCondition.Used,
    ownership_history: 1,
    description: `This is a 1998 late registration New Generation SAAB originally from Bond Street SAAB, Leicester.  
The car is in Pearl Bronze which was SAAB's anniversary colour for that year.  As an XS it is a 2 litre petrol injection model with sun-roof and air conditioning (the latter has not worked for many years). 
One owner before me when I bought it at 17,000 miles.  The car has a complete service record.  Over the years I have had numerous works done including the most recent clutch, replacement of the power steering hydraulic system and fuel regulator sensor.  The head gasket leaked a few hundred miles back but was successfully repaired using Steel Seal after complete flush of the cooling system.
In recent years, welding for MOT became an increasing requirement but but unfortunately is now a renovation project primarily due to a substantial welding required.  The main structural members of the chassis are sound but westcountry weather has taken its toll of fixings, brackets, exhaust and suspension mountings together with rusting through main floor and boot well.
Plenty of decent parts on this car including a new spare ignition coil, new wiper sets, tow bar and ball (used and detached).
I really don't want to break for parts or scrap this beloved vehicle.  Must go to a caring home to preserve this unusual model.`,
    images: [
        { id: 1, url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop" },
        { id: 2, url: "/api/placeholder/800/600" },
        { id: 3, url: "/api/placeholder/800/600" },
        { id: 4, url: "/api/placeholder/800/600" },
        { id: 5, url: "/api/placeholder/800/600" },
    ],
    
    // Extended fields for UI
    features: [
        "Leather Interior",
        "Navigation System",
        "Heated Seats",
        "Parking Sensors",
        "Reversing Camera",
        "Bluetooth Connectivity",
        "Cruise Control",
        "Climate Control",
        "Electric Windows",
        "Alloy Wheels"
    ],
    safetyFeatures: [
        "ABS",
        "Electronic Stability Control",
        "Airbags",
        "Lane Departure Warning",
        "Collision Warning",
        "Emergency Braking"
    ],
    dealer: id === 'private' ? undefined : {
        name: "Premium Motors London",
        rating: 4.8,
        reviewCount: 127,
        address: "123 High Street, London, SW1A 1AA",
        phone: "+44 20 1234 5678",
        email: "sales@premiummotors.co.uk",
        verified: true
    },
    privateSellerInfo: id === 'private' ? {
        name: "John Smith",
        phone: "+44 20 9876 5432",
        email: "john.smith@email.com"
    } : undefined,
    serviceHistory: {
        lastService: "2024-06-15",
        mot: "Valid",
        motExpiry: "2025-03-20",
        taxExpiry: "2025-08-31"
    },
    financing: {
        monthlyPayment: 399,
        deposit: 2899,
        term: 48,
        apr: 6.9
    },
    specs: {
        "Engine": "2.0L Diesel",
        "Power": "190 BHP",
        "Torque": "400 Nm",
        "Top Speed": "146 mph",
        "0-60mph": "7.1 seconds",
        "Fuel Economy": "58.9 mpg",
        "CO2 Emissions": "126 g/km",
        "Insurance Group": "28",
        "Weight": "1,570 kg"
    },
    dateAdded: "2024-07-28",
    views: 1247
});

export const CarDetails: React.FC<CarDetailsProps> = ({ carId }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    const carData = getMockCarData(carId);

    const formatPrice = (price: number) => `LKR ${price.toLocaleString()}`;
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{carData.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{carData.location}</span>
                        <Separator orientation="vertical" className="h-4" />
                        <Eye className="h-4 w-4" />
                        <span>{carData.views} views</span>
                        <Separator orientation="vertical" className="h-4" />
                        <Clock className="h-4 w-4" />
                        <span>Added {formatDate(carData.dateAdded)}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSaved(!isSaved)}
                        className="flex items-center gap-2"
                    >
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                        Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Share
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Images and Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <Card className='border-none rounded-none shadow-none p-0'>
                        <CardContent className="p-0">
                            <div className="relative">
                                <img
                                    src={carData.images[currentImageIndex].url}
                                    alt={`${carData.title} - Main Image`}
                                    width={800}
                                    height={600}
                                    className="w-full h-96 object-cover"
                                    onClick={() => setIsImageModalOpen(true)}
                                />                                {/* Navigation Arrows */}
                              

                                {/* Image Counter */}
                                <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                                    <Camera className="h-3 w-3" />
                                    {currentImageIndex + 1} / {carData.images.length}
                                </div>
                            </div>

                            {/* Thumbnail Strip */}
                          
                        </CardContent>
                    </Card>

                   

                    {/* Tabs for detailed information */}
                    {/* <Card>
                        <CardContent className="p-0">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="specs">Specifications</TabsTrigger>
                                    <TabsTrigger value="features">Features</TabsTrigger>
                                    <TabsTrigger value="history">History</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="overview" className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Description</h3>
                                            <p className="text-gray-700">{carData.description}</p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-semibold mb-2">Condition</h3>
                                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                                <CheckCircle className="h-3 w-3" />
                                                {carData.condition}
                                            </Badge>
                                        </div>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="specs" className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(carData.specs).map(([key, value]) => (
                                            <div key={key} className="flex justify-between items-center py-2 border-b">
                                                <span className="text-gray-600">{key}</span>
                                                <span className="font-medium">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="features" className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold mb-3">Standard Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {carData.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h3 className="font-semibold mb-3">Safety Features</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {carData.safetyFeatures.map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4 text-blue-500" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="history" className="p-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText className="h-4 w-4 text-blue-500" />
                                                    <span className="font-medium">MOT</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Status: {carData.serviceHistory.mot}</p>
                                                <p className="text-sm text-gray-600">Expires: {formatDate(carData.serviceHistory.motExpiry)}</p>
                                            </div>
                                            
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span className="font-medium">Last Service</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{formatDate(carData.serviceHistory.lastService)}</p>
                                            </div>
                                            
                                            <div className="p-4 border rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Calendar className="h-4 w-4 text-orange-500" />
                                                    <span className="font-medium">Tax Expiry</span>
                                                </div>
                                                <p className="text-sm text-gray-600">{formatDate(carData.serviceHistory.taxExpiry)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card> */}
                </div>

                {/* Right Column - Price and Dealer Info */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <Card className="top-4 border-5 border-primary">
                        <CardHeader>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-3xl font-bold">
                                            {formatPrice(carData.price)}
                                        </span>
                                     
                                    </div>
                                    {carData.seller_type === SellerType.Private && (
                                        <Badge variant="outline" className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            Private Seller
                                        </Badge>
                                    )}
                                </div>
                             
                            </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                            {/* Financing Option */}
                            {/* <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calculator className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-blue-900">Finance Option</span>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-2xl font-bold text-blue-600">{formatPrice(carData.financing.monthlyPayment)}</span> /month</p>
                                    <p className="text-gray-600">Deposit: {formatPrice(carData.financing.deposit)}</p>
                                    <p className="text-gray-600">{carData.financing.term} months • {carData.financing.apr}% APR</p>
                                </div>
                            </div> */}

                            <Button className="w-full" size="lg">
                                <Phone className="h-4 w-4 mr-2" />
                                {carData.seller_type === SellerType.Dealer ? 'Call Dealer' : 'Call Seller'}
                            </Button>
                            
                            <Button variant="outline" className="w-full" size="lg">
                                <Mail className="h-4 w-4 mr-2" />
                                {carData.seller_type === SellerType.Dealer ? 'Message Dealer' : 'Message Seller'}
                            </Button>
                            
                            {/* {carData.seller_type === SellerType.Dealer && (
                                <Button variant="outline" className="w-full" size="lg">
                                    Book Test Drive
                                </Button>
                            )} */}
                        </CardContent>
                    </Card>

                    {/* Seller Information */}
                    {carData.seller_type === SellerType.Dealer && carData.dealer && (
                        <Card className='bg-gray-50 border-0'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Dealer Information
                                    {carData.dealer.verified && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarImage src={carData.dealer.logo} />
                                        <AvatarFallback>{carData.dealer.name[0]}</AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{carData.dealer.name}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${
                                                            i < Math.floor(carData.dealer!.rating)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {carData.dealer.rating} ({carData.dealer.reviewCount} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5" />
                                        <span>{carData.dealer.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{carData.dealer.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{carData.dealer.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {carData.seller_type === SellerType.Private && carData.privateSellerInfo && (
                        <Card className='bg-gray-50'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Private Seller
                                </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarFallback>{carData.privateSellerInfo.name[0]}</AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{carData.privateSellerInfo.name}</h3>
                                        <p className="text-sm text-gray-600">Private Individual</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{carData.privateSellerInfo.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{carData.privateSellerInfo.email}</span>
                                    </div>
                                </div>
                                
                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-sm text-amber-800">
                                        <Shield className="h-4 w-4 inline mr-1" />
                                        Remember to inspect the vehicle thoroughly and verify all documentation before purchase.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
                
            </div>
             {/* Key Information */}
                    <Card className='border-none'>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                Key Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Year</p>
                                        <p className="font-medium">{carData.year}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Gauge className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Mileage</p>
                                        <p className="font-medium">{carData.mileage.toLocaleString()} km</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Fuel className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Fuel Type</p>
                                        <p className="font-medium">{carData.fuel_type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Transmission</p>
                                        <p className="font-medium">{carData.transmission}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Body Type</p>
                                        <p className="font-medium">{carData.body_type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Previous Owners</p>
                                        <p className="font-medium">{carData.ownership_history}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Color</p>
                                    <p className="font-medium">{carData.color}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Engine Size</p>
                                    <p className="font-medium">{carData.engine_size}L</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                                <hr/>

<div className='text-3xl font-bold'>Description</div>
<div className='whitespace-pre-wrap text-gray-500'>{carData.description}</div>

            {/* Image Modal */}
       
        </div>
    );
};
