"use client"

import { useState, useEffect } from "react"
import { SearchForm } from "@/components/search-form"
import { OfficeCard } from "@/components/office-card"
import { OfficeMap } from "@/components/office-map"
import { SearchFilters, SearchResult, PermitOffice } from "@/lib/types"
import { APP_CONFIG } from "@/lib/constants"
import { apiService } from "@/lib/api"


export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOffice, setSelectedOffice] = useState<PermitOffice | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Could not get user location:', error);
          // Don't show error to user, just continue without location
        }
      );
    }
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiService.searchPermitOffices(filters, userLocation || undefined)
      
      if (response.error) {
        setError(response.error)
        setSearchResults([])
      } else if (response.data) {
        // Transform API response to match our SearchResult interface
        const results: SearchResult[] = response.data.offices.map(office => ({
          office: {
            ...office,
            // Ensure coordinates are available for map display
            coordinates: office.latitude && office.longitude 
              ? { lat: office.latitude, lng: office.longitude }
              : undefined,
            // Map legacy fields for backward compatibility
            type: determineOfficeType(office.name),
            officeHours: formatOfficeHours(office.hours),
            onlinePortal: office.website ? true : false,
          },
          services: [], // Services will be populated separately if needed
          distance: office.distance,
        }))
        
        setSearchResults(results)
      }
    } catch (err) {
      console.error('Search failed:', err)
      setError('Failed to search permit offices. Please try again.')
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to determine office type from name
  const determineOfficeType = (name: string): 'county' | 'city' | 'state' | 'township' => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('county') || lowerName.includes('co.')) return 'county'
    if (lowerName.includes('city') || lowerName.includes('municipal')) return 'city'
    if (lowerName.includes('state') || lowerName.includes('department')) return 'state'
    if (lowerName.includes('township') || lowerName.includes('town')) return 'township'
    return 'county' // default
  }

  // Helper function to format office hours
  const formatOfficeHours = (hours?: Record<string, string>): string => {
    if (!hours) return 'Hours not available'
    
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const formattedHours = dayOrder
      .filter(day => hours[day])
      .map(day => {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1)
        return `${dayName}: ${hours[day]}`
      })
      .join(', ')
    
    return formattedHours || 'Hours not available'
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const handleGetDirections = (office: PermitOffice) => {
    if (office.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${office.coordinates.lat},${office.coordinates.lng}`
      window.open(url, '_blank')
    } else if (office.latitude && office.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${office.latitude},${office.longitude}`
      window.open(url, '_blank')
    } else {
      // Fallback to address-based directions
      const address = `${office.address}, ${office.city}, ${office.state} ${office.zipCode}`
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
      window.open(url, '_blank')
    }
  }

  const handleViewDetails = (office: PermitOffice) => {
    setSelectedOffice(office)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">{APP_CONFIG.name}</h1>
            <p className="text-xl text-muted-foreground mt-2">{APP_CONFIG.description}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="mb-8">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {searchResults.length > 0 && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Results List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                Found {searchResults.length} permit office{searchResults.length !== 1 ? 's' : ''}
              </h2>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <OfficeCard
                    key={result.office.id}
                    office={result.office}
                    services={result.services}
                    distance={result.distance}
                    onGetDirections={handleGetDirections}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="sticky top-4">
              <OfficeMap
                offices={searchResults.map(result => result.office)}
                userLocation={userLocation || undefined}
                selectedOffice={selectedOffice || undefined}
                onOfficeSelect={setSelectedOffice}
                className="h-[600px]"
              />
            </div>
          </section>
        )}

        {/* No Results */}
        {!isLoading && !error && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              <p className="text-lg">No permit offices found</p>
              <p className="text-sm mt-2">Try adjusting your search criteria or search for a different location</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 {APP_CONFIG.name}. Built with Next.js, Tailwind CSS, and shadcn/ui.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}