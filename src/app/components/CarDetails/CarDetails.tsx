'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVehicleById } from '@/lib/hooks/useVehicles';
import {
    SellerType
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
    Eye,
    Camera,
    User
} from 'lucide-react';

interface CarDetailsProps {
    carId: string;
}

export const CarDetails: React.FC<CarDetailsProps> = ({ carId }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    // Fetch vehicle data from API
    const { data: vehicleData, isLoading, isError, error } = useVehicleById(carId);

    const formatPrice = (price: number) => `LKR ${price.toLocaleString()}`;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError || !vehicleData) {
        return (
            <div className="max-w-7xl mx-auto p-4 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Not Found</h2>
                    <p className="text-gray-600 mb-4">
                        {error?.message || 'The vehicle you are looking for could not be found.'}
                    </p>
                    <Button onClick={() => window.history.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    // Use API data
    const carData = vehicleData;

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
                        <span>{formatDate(carData.created_at)}</span>
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
                                {carData.images && carData.images.length > 0 ? (
                                    <img
                                        src={carData.images[currentImageIndex].url}
                                        alt={`${carData.title} - Main Image`}
                                        className="w-full h-96 object-contain bg-gray-100 cursor-pointer"
                                        onClick={() => setIsFullscreenOpen(true)}
                                    />
                                ) : (
                                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                                        <div className="text-center text-gray-500">
                                            <Camera className="h-12 w-12 mx-auto mb-2" />
                                            <p>No images available</p>
                                        </div>
                                    </div>
                                )}

                                {/* Image Counter */}
                                {carData.images && carData.images.length > 0 && (
                                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                                        <Camera className="h-3 w-3" />
                                        {currentImageIndex + 1} / {carData.images.length}
                                    </div>
                                )}
                            </div>
                            
                            {/* Thumbnail Gallery */}
                            {carData.images && carData.images.length > 1 && (
                                <div className="space-y-2 mt-4">
                                    {/* First row - First 3 images */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {carData.images.slice(0, 3).map((image, index) => (
                                            <div
                                                key={index}
                                                className={`relative h-32 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                                                    currentImageIndex === index 
                                                        ? 'border-blue-500 ring-2 ring-blue-200' 
                                                        : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${carData.title} - Thumbnail ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {currentImageIndex === index && (
                                                    <div className="absolute inset-0 bg-blue-500/20"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Second row - Remaining images (scrollable) - Only show if more than 4 images */}
                                    {carData.images.length > 4 && (
                                        <div className="overflow-x-auto">
                                            <div className="flex gap-2 min-w-fit">
                                                {carData.images.slice(3).map((image, index) => {
                                                    const actualIndex = index + 3;
                                                    return (
                                                        <div
                                                            key={actualIndex}
                                                            className={`relative h-32 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                                                                currentImageIndex === actualIndex 
                                                                    ? 'border-blue-500 ring-2 ring-blue-200' 
                                                                    : 'border-gray-200 hover:border-gray-400'
                                                            }`}
                                                            onClick={() => setCurrentImageIndex(actualIndex)}
                                                        >
                                                            <img
                                                                src={image.url}
                                                                alt={`${carData.title} - Thumbnail ${actualIndex + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {currentImageIndex === actualIndex && (
                                                                <div className="absolute inset-0 bg-blue-500/20"></div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Price and Seller Info */}
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
                            <Button className="w-full" size="lg">
                                <Phone className="h-4 w-4 mr-2" />
                                {carData.seller_type === SellerType.Dealer ? 'Call Dealer' : 'Call Seller'}
                            </Button>

                            <Button variant="outline" className="w-full" size="lg">
                                <Mail className="h-4 w-4 mr-2" />
                                {carData.seller_type === SellerType.Dealer ? 'Message Dealer' : 'Message Seller'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Seller Information */}
                    {carData.seller_type === SellerType.Dealer && carData.posted_by.dealer_profile && (
                        <Card className='bg-gray-50 border-0'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    Dealer Information
                                    {carData.posted_by.dealer_profile?.verified && (
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
                                        <AvatarImage src={carData.posted_by.dealer_profile.logo_url} />
                                        <AvatarFallback>{carData.posted_by.dealer_profile.business_name[0]}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{carData.posted_by.dealer_profile.business_name}</h3>
                                        <div className="flex items-center gap-1 mt-1">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < Math.floor(carData.posted_by.dealer_profile?.rating || 0)
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                {carData.posted_by.dealer_profile.rating} ({carData.posted_by.dealer_profile.reviewCount} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-0.5" />
                                        <span>{carData.posted_by.dealer_profile.address}</span>
                                    </div>
                                    {<div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{carData.posted_by.dealer_profile.phone}</span>
                                    </div>}
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{carData.posted_by.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {carData.seller_type === SellerType.Private && carData.posted_by && (
                        <Card className='border-none shadow-none'>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Private Seller
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarFallback>{carData.posted_by.first_name[0]}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{carData.posted_by.first_name} {carData.posted_by.last_name}</h3>
                                        <p className="text-sm text-gray-600">Private Individual</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{carData.posted_by.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{carData.posted_by.email}</span>
                                    </div>
                                </div>

                                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="flex items-center gap-3 text-sm text-amber-800">
                                        <Shield size={40} className="" />
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
                            <Calendar className=" text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Year</p>
                                <p className="font-medium">{carData.year}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Gauge className=" text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Mileage</p>
                                <p className="font-medium">{carData.mileage.toLocaleString()} km</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Fuel className=" text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Fuel Type</p>
                                <p className="font-medium">{carData.fuel_type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Settings className=" text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Transmission</p>
                                <p className="font-medium">{carData.transmission}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Car className=" text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Body Type</p>
                                <p className="font-medium">{carData.body_type}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className=" text-gray-500" />
                            <div>
                                <p className="text-sm text-gray-500">Previous Owners</p>
                                <p className="font-medium">{carData.ownership_history}</p>
                            </div>
                        </div>
                        {carData.color && (
                            <div>
                                <p className="text-sm text-gray-500">Color</p>
                                <p className="font-medium">{carData.color}</p>
                            </div>
                        )}
                        {carData.engine_size && (
                            <div>
                                <p className="text-sm text-gray-500">Engine Size</p>
                                <p className="font-medium">{carData.engine_size}L</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>


            {/* Features Section */}
            {carData.features && carData.features.length > 0 && (
                <>
                    <div className='text-3xl font-bold'>Features</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {carData.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Description */}
            <div className='text-3xl font-bold'>Description</div>
            <div className='whitespace-pre-wrap text-gray-500'>{carData.description}</div>

            {/* Fullscreen Image Viewer */}
            {isFullscreenOpen && carData.images && carData.images.length > 0 && (
                <div 
                    className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col"
                    onClick={() => setIsFullscreenOpen(false)}
                >
                    {/* Close button */}
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={() => setIsFullscreenOpen(false)}
                            className="text-white hover:text-gray-300 p-2"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Main image - takes remaining space after thumbnails */}
                    <div 
                        className="flex-1 flex items-center justify-center p-4 pb-0"
                        onClick={(e) => e.stopPropagation()}
                        style={{ height: 'calc(100vh - 100px)' }}
                    >
                        <img
                            src={carData.images[currentImageIndex].url}
                            alt={`${carData.title} - Fullscreen`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Thumbnail gallery at bottom - fixed height */}
                    <div 
                        className="bg-black bg-opacity-80 p-4 h-24 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="overflow-x-auto h-full">
                            <div className="flex gap-2 justify-center min-w-fit mx-auto h-full items-center">
                                {carData.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`relative h-16 w-16 flex-shrink-0 cursor-pointer overflow-hidden rounded border-2 transition-all ${
                                            currentImageIndex === index 
                                                ? 'border-white ring-2 ring-white/50' 
                                                : 'border-gray-400 hover:border-gray-200'
                                        }`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`${carData.title} - Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {currentImageIndex === index && (
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
