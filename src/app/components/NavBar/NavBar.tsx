'use client';

import React, { useState } from 'react';
import { Search, Menu, X, User, Heart, Bell, MapPin, Phone, Mail } from 'lucide-react';
import { VehicleTypeSelector } from './VehicleTypeSelector/VehicleTypeSelector';
import Image from 'next/image';
import logo from '../../../../public/logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <nav className="mx-auto border-b sticky top-0 z-50 bg-white">
            {/* Top bar with contact info - hidden on mobile */}
            {/* <div className="hidden md:block bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>info@caro.lk</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span>Follow us:</span>
              <div className="flex space-x-2">
                <a href="#" className="hover:text-[#5ddbe8]">Facebook</a>
                <a href="#" className="hover:text-[#5ddbe8]">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div> */}

            {/* Vehicle Types Bar */}
            <VehicleTypeSelector />

            {/* Main navigation */}
            <div className="w-full py-3 px-3 md:p-0">

                <div className="flex justify-between items-center py-1">

                    <div className="flex items-center">
                        <Image src={logo} width={160} height={60} alt="Caro logo" className='' />
                    </div>
                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-700 hover:text-gray-500 font-bold">
                            Buy
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-500 font-bold">
                            Sell
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-500 font-bold">
                            Dealers
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-500 font-bold">
                            Reviews
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-500 font-bold">
                            Finance
                        </a>
                        <a href="#" className="text-gray-700 hover:text-gray-500 font-bold">
                            Insurance
                        </a>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Location */}
                        {/* <div className="hidden lg:flex items-center space-x-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Colombo</span>
            </div> */}

                        {/* Search Icon - mobile only */}
                        <button className="md:hidden p-2 text-gray-600 hover:text-[#5ddbe8]">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notifications */}
                        {/* <button className="p-2 text-gray-600 hover:text-[#5ddbe8] relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button> */}

                        {/* Favorites */}
                        <button className="flex flex-col items-center p-2 text-gray-600 hover:text-[#5ddbe8]">
                            <Heart className="w-5 h-5" />
                            <span className="hidden sm:block text-sm">Saved</span>

                        </button>

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex flex-col items-center space-x-1 p-2 text-gray-600 hover:text-[#5ddbe8]"
                            >
                                <User className="w-5 h-5" />
                                <span className="hidden sm:block text-sm">Account</span>
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        My Profile
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        My Listings
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Saved Vehicles
                                    </a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Messages
                                    </a>
                                    <hr className="my-1" />
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Sign Out
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Sell Button */}
                        <button className="hidden sm:block bg-[#ee0841] hover:bg-red-500 text-white font-bold px-4 py-2 rounded-md transition-colors">
                            Sell Your Car
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-[#5ddbe8]"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t bg-white">
                        <div className="py-4 space-y-3">
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#5ddbe8]">
                                Buy
                            </a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#5ddbe8]">
                                Sell
                            </a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#5ddbe8]">
                                Dealers
                            </a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#5ddbe8]">
                                Reviews
                            </a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#5ddbe8]">
                                Finance
                            </a>
                            <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#5ddbe8]">
                                Insurance
                            </a>
                            <div className="px-4 py-2">
                                <button className="w-full bg-red-800 hover:bg-orange-600 text-white px-4 py-3 rounded-md font-medium">
                                    Sell Your Car
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;