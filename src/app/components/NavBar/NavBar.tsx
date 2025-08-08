'use client';

import React from 'react';
import { Menu, User, ChevronDown, Heart } from 'lucide-react';
import { VehicleTypeSelector } from './VehicleTypeSelector/VehicleTypeSelector';
import Image from 'next/image';
import logo from '../../../../public/logo.png';
import { useVehicleTypeStore } from '@/app/store/vehicleSlice';
import { useAuth, useUserInfo } from '@/app/store/userSlice';
import { useLogout } from '@/lib/hooks/useAuth';
import { vehicleSubmenus } from '@/app/Types/CommonTypes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Navbar = () => {
    const { selectedVehicleType } = useVehicleTypeStore();
    const { isAuthenticated } = useAuth();
    const { fullName } = useUserInfo();
    const logoutMutation = useLogout();
    const pathname = usePathname();

    const handleLogout = () => {
        logoutMutation.mutate();
    };
    const renderSubMenus = () => {
        const submenus = selectedVehicleType ? vehicleSubmenus[selectedVehicleType] : null

        if (!submenus) return null

        return Object.values(submenus).map((item) => (
            <a
                key={item.link}
                href={item.link}
                className="text-gray-700 hover:text-gray-500 font-bold"
            >
                {item.label}
            </a>
        ))
    }

    return (
        <nav className="mx-auto border-b sticky top-0 z-50 bg-white ">

            {/* Vehicle Types Bar */}
            <VehicleTypeSelector />

            {/* Main navigation */}
            <div className="w-full py-3 px-3 md:py-2 md:px-0">

                <div className="flex justify-between gap-5 items-center py-1">

                    <div className="flex items-center">
                        <Link href='/'>
                            <Image src={logo} width={160} height={60} alt="Caro logo" className='' />

                        </Link>
                    </div>
                    {/* Desktop Navigation Links */}
                    <div className='flex w-full justify-end md:justify-between'>
                        <div className="hidden md:flex items-center space-x-8">
                            {renderSubMenus()}
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center sm:space-x-4">



                            {/* Search Icon - mobile only */}
                            {/* <button className="hidden p-2 text-gray-600 hover:text-[#5ddbe8]">
                                <Search className="w-5 h-5" />
                            </button> */}

                            {/* Favorites */}
                            <button className="flex gap-3 items-center p-2 text-gray-700 font-bold hover:text-gray-500">
                                <Heart className="" />
                                <span className="hidden sm:block text-sm">Saved</span>

                            </button>

                            {/* User Menu */}
                            {/* User Menu with DropdownMenu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="text-xs md:text-md flex items-center px-3 py-2 rounded-md font-bold text-gray-700 hover:text-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                                        <User className=" mr-2" />
                                        {fullName || 'User'}
                                        <ChevronDown className=" ml-1" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 font-bold">
                                    {isAuthenticated ? <><DropdownMenuLabel className='font-bold text-gray-500'>My Account</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem onClick={() => { }}>
                                        Profile
                                    </DropdownMenuItem><DropdownMenuItem onClick={() => { }}>
                                            My Listings
                                        </DropdownMenuItem><DropdownMenuItem onClick={() => { }}>
                                            Settings
                                        </DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={handleLogout} className='text-red-700'>
                                            Sign out
                                        </DropdownMenuItem></> :
                                        <>
                                        <DropdownMenuLabel className='font-bold text-gray-500'>You are not signed in</DropdownMenuLabel><DropdownMenuSeparator />
                                        <Link href={'/login'}><DropdownMenuItem className='text-gray-500'>
                                                Log In
                                            </DropdownMenuItem></Link>
                                             <Link href={'/register'}><DropdownMenuItem className='text-gray-500'>
                                                Sign Up
                                            </DropdownMenuItem></Link>
                                            </>
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>                            {/* Sell Button */}
                            {pathname !== '/create-listing' && (
                                <Link className='hidden sm:block md:mr-0' href={isAuthenticated ? '/create-listing' : '/login'}>
                                    <button className=" bg-[#ee0841] hover:bg-red-500 text-white font-bold px-4 py-2 rounded-md transition-colors ">
                                        Sell Your Vehicle
                                    </button>
                                </Link>
                            )}

                            {/* Mobile menu button with Sheet */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden p-2 text-gray-600 hover:text-[#5ddbe8]">
                                        <Menu className="w-6 h-6" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                    <SheetHeader>
                                        <SheetTitle>Menu</SheetTitle>
                                        <SheetDescription>
                                            Navigate through our services
                                        </SheetDescription>
                                    </SheetHeader>
                                    
                                    <div className="mt-6 space-y-4">
                                        {/* Vehicle Type Selector */}
                                        <div className="border-b pb-4">
                                            <VehicleTypeSelector />
                                        </div>

                                        {/* Sub-menu items */}
                                        {selectedVehicleType && (
                                            <div className="space-y-2">
                                                {Object.values(vehicleSubmenus[selectedVehicleType] || {}).map((item) => (
                                                    <Link
                                                        key={item.link}
                                                        href={item.link}
                                                        className="block px-3 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#5ddbe8] rounded-md"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {/* User Section */}
                                        <div className="border-t pt-4">
                                            {isAuthenticated ? (
                                                <div className="space-y-4">
                                                    <div className="px-3">
                                                        <p className="text-sm text-gray-600">Welcome, {fullName || 'User'}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Button variant="ghost" className="w-full justify-start">
                                                            Profile
                                                        </Button>
                                                        <Button variant="ghost" className="w-full justify-start">
                                                            My Listings
                                                        </Button>
                                                        <Button variant="ghost" className="w-full justify-start">
                                                            Settings
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={handleLogout}
                                                        >
                                                            Sign out
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-gray-600 px-3">You are not signed in</p>
                                                    <div className="space-y-2">
                                                        <Link href="/login">
                                                            <Button variant="outline" className="w-full">
                                                                Sign In
                                                            </Button>
                                                        </Link>
                                                        <Link href="/register">
                                                            <Button className="w-full">
                                                                Register
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Sell Your Car Button */}
                                        <div className="border-t pt-4">
                                            <Link href={isAuthenticated ? '/create-listing' : '/login'}>
                                                <Button className="w-full bg-[#ee0841] hover:bg-red-500 text-white">
                                                    Sell Your Vehicle
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;