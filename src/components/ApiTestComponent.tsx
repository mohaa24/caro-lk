'use client';

import { useState } from 'react';
import { useVehiclesPublic } from '@/lib/hooks/useVehicles';
import { useLogin, useRegister } from '@/lib/hooks/useAuth';
import { useAuth } from '@/app/store/userSlice';
import type { UserLogin, UserCreate } from '@/lib/types/auth';

export default function ApiTestComponent() {
  const [loginData, setLoginData] = useState<UserLogin>({ email: '', password: '' });
  const [registerData, setRegisterData] = useState<UserCreate>({ 
    email: '', 
    password: '',
    first_name: '',
    last_name: '',
    user_type: 'Individual'
  });

  // Hooks
  const { data: vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehiclesPublic();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerData);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Integration Test</h1>
      
      {/* Auth Status */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        {authLoading ? (
          <p>Loading auth...</p>
        ) : isAuthenticated ? (
          <div className="text-green-600">
            <p>✅ Authenticated as: {user?.email}</p>
            <p>User Type: {user?.user_type}</p>
            <p>Name: {user?.first_name} {user?.last_name}</p>
          </div>
        ) : (
          <p className="text-red-600">❌ Not authenticated</p>
        )}
      </div>

      {/* Login Form */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
            {loginMutation.error && (
              <p className="text-red-600">Login failed: {String(loginMutation.error)}</p>
            )}
          </form>
        </div>
      )}

      {/* Register Form */}
      {!isAuthenticated && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="First Name"
              value={registerData.first_name || ''}
              onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={registerData.last_name || ''}
              onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <select
              value={registerData.user_type}
              onChange={(e) => setRegisterData({ ...registerData, user_type: e.target.value as 'Individual' | 'Dealership' })}
              className="w-full p-2 border rounded"
            >
              <option value="Individual">Individual</option>
              <option value="Dealership">Dealership</option>
            </select>
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </button>
            {registerMutation.error && (
              <p className="text-red-600">Registration failed: {String(registerMutation.error)}</p>
            )}
            {registerMutation.isSuccess && (
              <p className="text-green-600">Registration successful! Please login.</p>
            )}
          </form>
        </div>
      )}

      {/* Public Vehicles List */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Public Vehicles</h2>
        {vehiclesLoading ? (
          <p>Loading vehicles...</p>
        ) : vehiclesError ? (
          <p className="text-red-600">Error loading vehicles: {String(vehiclesError)}</p>
        ) : vehicles && vehicles.length > 0 ? (
          <div className="space-y-4">
            <p className="text-green-600">✅ Found {vehicles.length} vehicles</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.slice(0, 6).map((vehicle) => (
                <div key={vehicle.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{vehicle.make} {vehicle.model}</h3>
                  <p className="text-gray-600">Year: {vehicle.year}</p>
                  <p className="text-gray-600">Price: Rs. {vehicle.price.toLocaleString()}</p>
                  <p className="text-gray-600">Location: {vehicle.location}</p>
                  <p className="text-gray-600">Fuel: {vehicle.fuel_type}</p>
                  <p className="text-gray-600">Transmission: {vehicle.transmission}</p>
                </div>
              ))}
            </div>
            {vehicles.length > 6 && (
              <p className="text-gray-600">...and {vehicles.length - 6} more vehicles</p>
            )}
          </div>
        ) : (
          <p className="text-yellow-600">No vehicles found</p>
        )}
      </div>
    </div>
  );
}
