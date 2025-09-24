'use client';

import { useEffect, useRef } from 'react';
import { googleConfig } from '@/lib/googleConfig';

// Declare global google namespace
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
        MapTypeId: { ROADMAP: string };
        Marker: new (options: Record<string, unknown>) => unknown;
        places: {
          Autocomplete: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
        };
      };
    };
  }
}

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export default function GoogleMap({ 
  center = { lat: 37.7749, lng: -122.4194 }, // San Francisco default
  zoom = 10,
  className = "w-full h-96"
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || !googleConfig.mapsApiKey) return;

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleConfig.mapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || !window.google) return;

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add a marker for the center point
      new window.google.maps.Marker({
        position: center,
        map: mapInstanceRef.current,
        title: 'Permit Office Location'
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full rounded-lg border" />
      {!googleConfig.mapsApiKey && (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
          <p className="text-gray-500">Google Maps API key not configured</p>
        </div>
      )}
    </div>
  );
}
