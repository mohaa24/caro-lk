'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AuthGuard } from '@/components/AuthGuard';
import { useCreateVehicle } from '@/lib/hooks/useVehicles';
import { useAuth } from '@/app/store/userSlice';
import {
  VehicleType,
  FuelType,
  TransmissionType,
  SellerType,
  ImportStatus,
  VehicleCondition,
  VehicleCreate
} from '@/app/Types/CommonTypes';
import {
  Car,
  Plus,
  X,
  Upload
} from 'lucide-react';

const CreateListingContent = () => {
  const [formData, setFormData] = useState<VehicleCreate>({
    vehicle_type: VehicleType.Car,
    title: '',
    make: '',
    model: '',
    variant: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel_type: FuelType.Petrol,
    transmission: TransmissionType.Manual,
    body_type: 'Sedan',
    color: '',
    engine_size: 0,
    doors: 4,
    location: '',
    seller_type: SellerType.Private,
    import_status: ImportStatus.UsedImport,
    condition: VehicleCondition.Used,
    ownership_history: 1,
    description: '',
    features: []
  });

  const [newFeature, setNewFeature] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createVehicleMutation = useCreateVehicle();
  const { isAuthenticated, user } = useAuth();

  // Debug authentication status
  console.log('Auth Status:', { isAuthenticated, user: user?.email, token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null });

  const commonFeatures = [
    'Air Conditioning', 'Power Steering', 'Central Locking', 'Power Windows',
    'ABS', 'Airbags', 'Alloy Wheels', 'Electric Mirrors', 'Fog Lights',
    'GPS Navigation', 'Bluetooth', 'USB Port', 'Parking Sensors', 'Backup Camera',
    'Sunroof', 'Leather Seats', 'Heated Seats', 'Cruise Control'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields based on API schema
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.make.trim()) newErrors.make = 'Make is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year';
    }
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.mileage < 0) newErrors.mileage = 'Mileage cannot be negative';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // API requires these fields to be non-null
    if (!formData.color || !formData.color.trim()) newErrors.color = 'Color is required';
    if (!formData.doors || formData.doors < 2) newErrors.doors = 'Number of doors is required';
    if (!formData.import_status) newErrors.import_status = 'Import status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof VehicleCreate, value: string | number | VehicleType | FuelType | TransmissionType | SellerType | ImportStatus | VehicleCondition | string[] | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addFeature = (feature: string) => {
    if (feature && !(formData.features || []).includes(feature)) {
      handleInputChange('features', [...(formData.features || []), feature]);
    }
  };

  const removeFeature = (feature: string) => {
    handleInputChange('features', (formData.features || []).filter(f => f !== feature));
  };

  const handleCustomFeatureAdd = () => {
    if (newFeature.trim()) {
      addFeature(newFeature.trim());
      setNewFeature('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      return isValidType && isValidSize;
    });
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please ensure all files are images under 5MB.');
    }
    
    setImages(prev => [...prev, ...validFiles].slice(0, 10)); // Max 10 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For now, we'll submit without images since the API expects image URLs
      // TODO: Implement image upload to a file storage service first
      const vehicleData: VehicleCreate = {
        ...formData,
        images: undefined // Remove images for now since we need to upload them first
      };
      
      console.log('Submitting vehicle data:', vehicleData);
      
      const result = await createVehicleMutation.mutateAsync(vehicleData);
      
      alert('Vehicle listing created successfully!');
      console.log('Created vehicle:', result);
      // TODO: Redirect to the created vehicle page or listings page
      
    } catch (error: unknown) {
      console.error('Error creating listing:', error);
      
      // Show more specific error messages
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; data: { detail?: string } } };
        if (axiosError.response?.status === 401) {
          alert('You are not authenticated. Please log in and try again.');
        } else if (axiosError.response?.status === 422) {
          alert('Invalid data provided. Please check your form and try again.');
        } else if (axiosError.response?.data?.detail) {
          alert(`Error: ${axiosError.response.data.detail}`);
        } else {
          alert('Failed to create listing. Please try again.');
        }
      } else {
        alert('Failed to create listing. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Vehicle Listing</h1>
        <p className="text-gray-600">Fill in the details below to list your vehicle</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                <Select 
                  value={formData.vehicle_type} 
                  onValueChange={(value) => handleInputChange('vehicle_type', value as VehicleType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VehicleType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="seller_type">Seller Type *</Label>
                <Select 
                  value={formData.seller_type} 
                  onValueChange={(value) => handleInputChange('seller_type', value as SellerType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(SellerType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="title">Listing Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., 2020 Toyota Corolla Hybrid"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  placeholder="e.g., Toyota"
                  className={errors.make ? 'border-red-500' : ''}
                />
                {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
              </div>

              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="e.g., Corolla"
                  className={errors.model ? 'border-red-500' : ''}
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div>
                <Label htmlFor="variant">Variant</Label>
                <Input
                  id="variant"
                  value={formData.variant || ''}
                  onChange={(e) => handleInputChange('variant', e.target.value)}
                  placeholder="e.g., Hybrid, Sport"
                />
              </div>

              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={errors.year ? 'border-red-500' : ''}
                />
                {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fuel_type">Fuel Type *</Label>
                <Select 
                  value={formData.fuel_type} 
                  onValueChange={(value) => handleInputChange('fuel_type', value as FuelType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(FuelType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="transmission">Transmission *</Label>
                <Select 
                  value={formData.transmission} 
                  onValueChange={(value) => handleInputChange('transmission', value as TransmissionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TransmissionType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="body_type">Body Type *</Label>
                <Input
                  id="body_type"
                  value={formData.body_type}
                  onChange={(e) => handleInputChange('body_type', e.target.value)}
                  placeholder="e.g., Sedan, SUV, Hatchback"
                />
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value) => handleInputChange('condition', value as VehicleCondition)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(VehicleCondition).map(condition => (
                      <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="import_status">Import Status *</Label>
                <Select 
                  value={formData.import_status} 
                  onValueChange={(value) => handleInputChange('import_status', value as ImportStatus)}
                >
                  <SelectTrigger className={errors.import_status ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ImportStatus).map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.import_status && <p className="text-red-500 text-sm mt-1">{errors.import_status}</p>}
              </div>

              <div>
                <Label htmlFor="color">Color *</Label>
                <Input
                  id="color"
                  value={formData.color || ''}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="e.g., White, Black"
                  className={errors.color ? 'border-red-500' : ''}
                />
                {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
              </div>

              <div>
                <Label htmlFor="doors">Number of Doors *</Label>
                <Input
                  id="doors"
                  type="number"
                  value={formData.doors || ''}
                  onChange={(e) => handleInputChange('doors', parseInt(e.target.value) || undefined)}
                  min="2"
                  max="6"
                  className={errors.doors ? 'border-red-500' : ''}
                />
                {errors.doors && <p className="text-red-500 text-sm mt-1">{errors.doors}</p>}
              </div>

              <div>
                <Label htmlFor="engine_size">Engine Size (L)</Label>
                <Input
                  id="engine_size"
                  type="number"
                  step="0.1"
                  value={formData.engine_size || ''}
                  onChange={(e) => handleInputChange('engine_size', parseFloat(e.target.value) || undefined)}
                  placeholder="e.g., 1.5, 2.0"
                />
              </div>

              <div>
                <Label htmlFor="mileage">Mileage (km) *</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                  min="0"
                  className={errors.mileage ? 'border-red-500' : ''}
                />
                {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
              </div>

              <div>
                <Label htmlFor="ownership_history">Previous Owners</Label>
                <Input
                  id="ownership_history"
                  type="number"
                  value={formData.ownership_history}
                  onChange={(e) => handleInputChange('ownership_history', parseInt(e.target.value))}
                  min="0"
                  max="10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing and Location */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (LKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                  min="0"
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Colombo, Kandy"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {commonFeatures.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={(formData.features || []).includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        addFeature(feature);
                      } else {
                        removeFeature(feature);
                      }
                    }}
                  />
                  <Label htmlFor={feature} className="text-sm">{feature}</Label>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add custom feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomFeatureAdd())}
              />
              <Button type="button" onClick={handleCustomFeatureAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {(formData.features && formData.features.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map(feature => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
              placeholder="Describe your vehicle in detail..."
              rows={5}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload vehicle photos (max 10)</p>
              <p className="text-sm text-gray-500 mb-4">JPG, PNG up to 5MB each</p>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="outline">
                  Choose Photos
                </Button>
              </Label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                      width={96}
                      height={96}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default function CreateListingPage() {
  return (
    <AuthGuard>
      <CreateListingContent />
    </AuthGuard>
  );
}
