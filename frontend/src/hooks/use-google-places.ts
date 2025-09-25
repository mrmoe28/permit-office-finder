"use client"

import { useEffect, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

export interface PlaceResult {
  formatted_address: string
  place_id: string
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
}

export function useGooglePlaces() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null)
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

      if (!apiKey || apiKey.includes('placeholder')) {
        console.warn('Google Places API key not configured')
        return
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places'],
        })

        await loader.load()

        // Create services
        const autoService = new google.maps.places.AutocompleteService()
        const placesService = new google.maps.places.PlacesService(
          document.createElement('div')
        )

        setAutocompleteService(autoService)
        setPlacesService(placesService)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error loading Google Maps:', error)
      }
    }

    loadGoogleMaps()
  }, [])

  const searchPlaces = (
    input: string,
    callback: (predictions: google.maps.places.AutocompletePrediction[]) => void
  ) => {
    if (!autocompleteService || !input.trim()) {
      callback([])
      return
    }

    autocompleteService.getPlacePredictions(
      {
        input,
        types: ['address'],
        componentRestrictions: { country: 'us' },
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          callback(predictions)
        } else {
          callback([])
        }
      }
    )
  }

  const getPlaceDetails = (
    placeId: string,
    callback: (place: PlaceResult | null) => void
  ) => {
    if (!placesService) {
      callback(null)
      return
    }

    placesService.getDetails(
      {
        placeId,
        fields: ['formatted_address', 'place_id', 'geometry'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          callback({
            formatted_address: place.formatted_address || '',
            place_id: place.place_id || '',
            geometry: place.geometry ? {
              location: {
                lat: place.geometry.location?.lat() || 0,
                lng: place.geometry.location?.lng() || 0,
              }
            } : undefined,
          })
        } else {
          callback(null)
        }
      }
    )
  }

  return {
    isLoaded,
    searchPlaces,
    getPlaceDetails,
  }
}