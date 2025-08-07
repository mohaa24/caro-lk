'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label";
import { Search } from "lucide-react"
import newCar from '../../../../public/newCar.png';
import Image from "next/image";
import { SearchableSelect } from "@/components/ui/searchable-select";
import vehicleData from '@/data/vehicleData.json';
import locationData from '@/data/locationData.json';
import Link from "next/link";
import { useVehicleFilters } from '@/app/store/filtersSlice';
import { useURLSync } from '@/lib/hooks/useURLSync';
export const SearchComp = () => {
    const { filters, setFilter } = useVehicleFilters();
    
    // Initialize URL synchronization
    useURLSync();
    
    // Get all locations
    const allLocations = [
        ...locationData.popularCities,
        ...Object.keys(locationData.locationsByDistrict).flatMap(district => 
            locationData.locationsByDistrict[district as keyof typeof locationData.locationsByDistrict]
        )
    ].filter((location, index, array) => array.indexOf(location) === index).sort();


    return (
        <div className=" flex flex-col-reverse gap-3 justify-center w-full md:justify-between  p-5 md:flex-row md:gap-0 md:pr-0 bg-cover bg-[#ee0841]"
        // style={{ backgroundImage: `url("bg.jpeg")` }}
        >
            <Card className=" gap-0 p-5 px-2 min-w-[300px] ">
                <CardHeader className="text-4xl font-thin"> Cars for sale</CardHeader>
                <CardContent className="">
                    <div className=" space-y-2 flex flex-col justify-between">
                        <Label>Location</Label>
                        <SearchableSelect
                            options={allLocations}
                            value={filters.location}
                            onValueChange={(value) => setFilter('location', value)}
                            placeholder="Select location"
                            searchPlaceholder="Search locations..."
                        />
                        <Label>Make</Label>
                        <SearchableSelect
                            options={vehicleData.makes}
                            value={filters.make}
                            onValueChange={(value) => {
                                setFilter('make', value);
                                // Clear model when make changes
                                setFilter('model', '');
                            }}
                            placeholder="Select make"
                            searchPlaceholder="Search makes..."
                        />
                        <Label>Model</Label>
                        <SearchableSelect
                            options={filters.make ? vehicleData.modelsByMake[filters.make] || [] : []}
                            value={filters.model}
                            onValueChange={(value) => setFilter('model', value)}
                            placeholder={filters.make ? "Select model" : "Select make first"}
                            searchPlaceholder="Search models..."
                            disabled={!filters.make}
                            emptyMessage={filters.make ? "No models found" : "Select make first"}
                        />

                        <Link href={'cars/car-search'}>
                            <Button className="my-3 w-full">
                                <Search /> Search
                            </Button>
                        </Link>
                 
                    </div>

                </CardContent>
            </Card>
            <Image src={newCar} height={400} alt="Buy new car" className=" md:block" />

        </div>
    )
}