'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { Select } from "@radix-ui/react-select";
import { Search } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form";
import newCar from '../../../../public/newCar.png';
import Image from "next/image";
export const SearchComp = () => {
    const [location, setLocation] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ location, minPrice, maxPrice });
        // Handle form submission here
    };
    const form = useForm()


    return (
        <div className=" flex flex-col-reverse gap-3 justify-center w-full md:justify-between  p-5 md:flex-row md:gap-0 md:pr-0 bg-cover bg-[#ee0841]"
        // style={{ backgroundImage: `url("bg.jpeg")` }}
        >
            <Card className=" gap-0 p-5 px-2 min-w-[300px] ">
                <CardHeader className="text-4xl font-thin"> Cars for sale</CardHeader>
                <CardContent className="">
                    <div className=" space-y-2 flex flex-col">
                        <Label>Location</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Label>Make</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Label>Model</Label>
                        <Select>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Button className="my-3"> <Search /> Search</Button>
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