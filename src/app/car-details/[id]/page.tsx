'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { CarDetails } from '@/app/components/CarDetails/CarDetails';

function CarDetailsPageContent() {
    const params = useParams();
    const { id } = params;

    return <CarDetails carId={id as string} />;
}

export default function CarDetailsPage() {
    return (
        <Suspense fallback={<div>Loading vehicle details...</div>}>
            <CarDetailsPageContent />
        </Suspense>
    );
}