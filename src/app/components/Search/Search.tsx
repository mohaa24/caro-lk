'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@radix-ui/react-label";
import { Search } from "lucide-react"
import { useState } from "react"
import newCar from '../../../../public/newCar.png';
import Image from "next/image";
import { SearchableSelect } from "@/components/ui/searchable-select";
import vehicleData from '@/data/vehicleData.json';
import locationData from '@/data/locationData.json';
export const SearchComp = () => {
    const [location, setLocation] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ location, make, model });
        // Handle form submission here
    };

    // Get popular makes (first 20 most popular)
    const popularMakes = Object.keys(vehicleData.modelsByMake).slice(0, 20);
    
    // Get models for selected make
    const modelsByMake = vehicleData.modelsByMake as { [key: string]: string[] };
    
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
                    <div className=" space-y-2 flex flex-col">
                        <Label>Location</Label>
                        <SearchableSelect
                            options={allLocations}
                            value={location}
                            onValueChange={setLocation}
                            placeholder="Select location"
                            searchPlaceholder="Search locations..."
                        />
                        <Label>Make</Label>
                        <SearchableSelect
                            options={popularMakes}
                            value={make}
                            onValueChange={(value) => {
                                setMake(value);
                                // Clear model when make changes
                                setModel('');
                            }}
                            placeholder="Select make"
                            searchPlaceholder="Search makes..."
                        />
                        <Label>Model</Label>
                        <SearchableSelect
                            options={make ? modelsByMake[make] || [] : []}
                            value={model}
                            onValueChange={setModel}
                            placeholder={make ? "Select model" : "Select make first"}
                            searchPlaceholder="Search models..."
                            disabled={!make}
                            emptyMessage={make ? "No models found" : "Select make first"}
                        />

                        <Button className="my-3" onClick={handleSubmit}> <Search /> Search</Button>
                        {/* <div className="flex gap-3 justify-between py-2">
                            <button className="text-blue-500 underline">Reset</button>
                            <button className="text-blue-500 underline">Advanced filter</button>

                        </div> */}
                    </div>

                </CardContent>
            </Card>
            <Image src={newCar} height={400} alt="Buy new car" className=" md:block" />

        </div>
    )
}