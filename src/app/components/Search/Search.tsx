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
        <div className=" flex bg-gray-50 p-5 bg-cover" style={{ backgroundImage: `url("bg.jpeg")` }}>
            <Card className="p-5 px-2 min-w-[300px]">
                <CardHeader className="text-2xl font-thin"> Cars for sale</CardHeader>
                <CardContent>
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
                        <div className="flex gap-3 justify-between py-2">
                            <button className="text-blue-500 underline">Reset</button>
                            <button className="text-blue-500 underline">Advanced filter</button>

                        </div>
                    </div>


                </CardContent>
            </Card>
        </div>
    )
}