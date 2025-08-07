'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useCallback, useRef } from 'react';
import { useVehicleFilters, VehicleFilters } from '@/app/store/filtersSlice';
import { filtersToURLParams, urlParamsToFilters } from '@/lib/utils/urlSync';

export const useURLSync = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilter } = useVehicleFilters();
  const isInitialized = useRef(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (!isInitialized.current) {
      const urlFilters = urlParamsToFilters(searchParams);
      
      // Only update if there are URL parameters
      if (Object.keys(urlFilters).length > 0) {
        Object.entries(urlFilters).forEach(([key, value]) => {
          if (value !== undefined) {
            setFilter(key as keyof VehicleFilters, value as VehicleFilters[keyof VehicleFilters]);
          }
        });
      }
      isInitialized.current = true;
    }
  }, [searchParams, setFilter]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    if (!isInitialized.current) return; // Don't update URL during initialization
    
    const urlParams = filtersToURLParams(filters);
    const newURL = urlParams.toString() ? `?${urlParams.toString()}` : window.location.pathname;
    
    // Only update if URL would change
    const currentParams = new URLSearchParams(window.location.search);
    if (urlParams.toString() !== currentParams.toString()) {
      router.replace(newURL, { scroll: false });
    }
  }, [filters, router]);

  // Debounced URL update to avoid too many updates
  useEffect(() => {
    const timeoutId = setTimeout(updateURL, 300);
    return () => clearTimeout(timeoutId);
  }, [updateURL]);

  return {
    updateURL: updateURL
  };
};
