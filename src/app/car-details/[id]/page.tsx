'use client';

import { useParams } from 'next/navigation';
import { CarDetails } from '@/app/components/CarDetails/CarDetails';

export default function CarDetailsPage() {
    const params = useParams();
    const { id } = params;

    return <CarDetails carId={id as string} />;
}