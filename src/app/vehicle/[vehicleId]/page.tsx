'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CarDetails } from '@/app/components/CarDetails/CarDetails';

function VehicleDetailsPageContent() {
    const params = useParams();
    const { vehicleId } = params;

    return <CarDetails carId={vehicleId as string} />;
}

export default function VehicleDetailsPage() {
    return (
        <Suspense fallback={<div>Loading vehicle details...</div>}>
            <VehicleDetailsPageContent />
        </Suspense>
    );
}