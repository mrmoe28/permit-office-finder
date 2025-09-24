'use client';

import { useEffect, useRef, useState } from 'react';
import { googleConfig } from '@/lib/googleConfig';

interface PlaceResult {
  place_id: string;
  formatted_address: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface PlacesSearchProps {
  onPlaceSelect: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

export default function PlacesSearch({ 
  onPlaceSelect, 
  placeholder = "Search for permit offices...",
  className = "w-full"
}: PlacesSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<unknown>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!googleConfig.placesApiKey) {
      console.warn('Google Places API key not configured');
      return;
    }

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleConfig.placesApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    // Initialize Google Places Autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['establishment'],
      fields: ['place_id', 'formatted_address', 'name', 'geometry']
    });

    // Listen for place selection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (autocompleteRef.current as any).addListener('place_changed', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const place = (autocompleteRef.current as any)?.getPlace();
      if (place && place.place_id) {
        onPlaceSelect(place as PlaceResult);
      }
    });

    return () => {
      if (autocompleteRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window.google.maps as any).event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onPlaceSelect]);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={!isLoaded}
      />
      {!isLoaded && (
        <p className="text-sm text-gray-500 mt-1">Loading Google Places...</p>
      )}
    </div>
  );
}
