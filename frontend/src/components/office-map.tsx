"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PermitOffice } from "@/lib/types"
import { MAP_CONFIG } from "@/lib/constants"
import type { Map, Marker } from "mapbox-gl"

interface OfficeMapProps {
  offices: PermitOffice[]
  userLocation?: { lat: number; lng: number }
  selectedOffice?: PermitOffice
  onOfficeSelect?: (office: PermitOffice) => void
  className?: string
}

export function OfficeMap({ 
  offices, 
  userLocation, 
  selectedOffice, 
  onOfficeSelect,
  className = ""
}: OfficeMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<Map | null>(null)
  const markers = useRef<Marker[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const updateMarkers = useCallback(() => {
    if (!map.current || !isMapLoaded) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add user location marker
    if (userLocation) {
      const mapboxgl = (window as { mapboxgl: typeof import('mapbox-gl') }).mapboxgl
      const userMarker = new mapboxgl.Marker({
        color: '#3b82f6',
        scale: 1.2
      })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">Your Location</h3>
            </div>
          `)
        )
        .addTo(map.current!)
      
      markers.current.push(userMarker)
    }

    // Add office markers
    offices.forEach((office) => {
      const isSelected = selectedOffice?.id === office.id
      const mapboxgl = (window as { mapboxgl: typeof import('mapbox-gl') }).mapboxgl
      
      const marker = new mapboxgl.Marker({
        color: isSelected ? '#ef4444' : '#10b981',
        scale: isSelected ? 1.3 : 1
      })
        .setLngLat([office.coordinates?.lng || 0, office.coordinates?.lat || 0])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <div class="p-3 max-w-xs">
              <h3 class="font-semibold text-sm mb-1">${office.name}</h3>
              <p class="text-xs text-gray-600 mb-2">${office.address}, ${office.city}, ${office.state}</p>
              <div class="flex gap-1">
                <span class="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">${office.type}</span>
                ${office.onlinePortal ? '<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Online</span>' : ''}
              </div>
            </div>
          `)
        )
        .addTo(map.current!)

      marker.getElement().addEventListener('click', () => {
        onOfficeSelect?.(office)
      })

      markers.current.push(marker)
    })

    // Fit map to show all markers
    if (offices.length > 0) {
      const mapboxgl = (window as { mapboxgl: typeof import('mapbox-gl') }).mapboxgl
      const bounds = new mapboxgl.LngLatBounds()
      
      if (userLocation) {
        bounds.extend([userLocation.lng, userLocation.lat])
      }
      
      offices.forEach(office => {
        if (office.coordinates) {
          bounds.extend([office.coordinates.lng, office.coordinates.lat])
        }
      })
      
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }, [offices, selectedOffice, userLocation, isMapLoaded, onOfficeSelect])

  useEffect(() => {
    if (!mapContainer.current || !process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
      console.warn("Mapbox token not found")
      return
    }

    // Dynamically import mapbox-gl to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      ;(mapboxgl as typeof mapboxgl & { accessToken: string }).accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: userLocation || MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        minZoom: MAP_CONFIG.minZoom,
      })

      map.current.on('load', () => {
        setIsMapLoaded(true)
        updateMarkers()
      })

      map.current.on('click', () => {
        // Handle map clicks if needed
      })
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [userLocation, updateMarkers])

  useEffect(() => {
    updateMarkers()
  }, [updateMarkers])

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            essential: true
          })
        }
        
        // You might want to call a callback to update user location in parent component
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location.')
      }
    )
  }

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Map functionality requires a Mapbox access token.</p>
            <p className="text-sm">Please configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment variables.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="relative">
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-lg"
            style={{ minHeight: '400px' }}
          />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={getCurrentLocation}
              className="shadow-lg"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}