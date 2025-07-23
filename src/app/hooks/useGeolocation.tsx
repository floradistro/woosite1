'use client';

import { useState, useEffect } from 'react';

interface LocationData {
  city: string;
  zipCode: string;
  state: string;
  loading: boolean;
  error: string | null;
  hasPermission: boolean;
}

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export const useGeolocation = () => {
  const [locationData, setLocationData] = useState<LocationData>({
    city: '',
    zipCode: '',
    state: '',
    loading: true,
    error: null,
    hasPermission: false,
  });

  const getLocationFromCoords = async (latitude: number, longitude: number) => {
    try {
      // Using a free reverse geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      
      setLocationData(prev => ({
        ...prev,
        city: data.city || data.locality || 'Unknown City',
        zipCode: data.postcode || '00000',
        state: data.principalSubdivision || data.principalSubdivisionCode || '',
        loading: false,
        error: null,
        hasPermission: true,
      }));
    } catch (error) {
      // Silently handle error
      setLocationData(prev => ({
        ...prev,
        loading: false,
        error: 'Unable to determine your location',
        hasPermission: false,
      }));
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationData(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by this browser',
        hasPermission: false,
      }));
      return;
    }

    setLocationData(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        getLocationFromCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        // Silently handle error
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocationData(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          hasPermission: false,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  };

  useEffect(() => {
    // Check if we have cached location data
    const cachedLocation = localStorage.getItem('flora-location');
    if (cachedLocation) {
      try {
        const cachedData = JSON.parse(cachedLocation);
        const cacheAge = Date.now() - cachedData.timestamp;
        
        // Cache valid for 24 hours
        if (cacheAge < 24 * 60 * 60 * 1000) {
          setLocationData({
            city: cachedData.city,
            zipCode: cachedData.zipCode,
            state: cachedData.state,
            loading: false,
            error: null,
            hasPermission: true,
          });
          return;
        }
      } catch (error) {
        // Silently handle error
      }
    }

    // If no cached data or it's old, request new location
    requestLocation();
  }, []);

  // Cache location data when it changes
  useEffect(() => {
    if (locationData.city && locationData.zipCode && !locationData.loading) {
      localStorage.setItem('flora-location', JSON.stringify({
        city: locationData.city,
        zipCode: locationData.zipCode,
        state: locationData.state,
        timestamp: Date.now(),
      }));
    }
  }, [locationData.city, locationData.zipCode, locationData.state, locationData.loading]);

  return {
    ...locationData,
    requestLocation,
  };
}; 