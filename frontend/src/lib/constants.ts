// Application constants
export const APP_CONFIG = {
  name: "Permit Office Finder",
  description: "Find building permit offices by location or address",
  version: "1.0.0",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  googlePlacesKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
} as const

// Permit types
export const PERMIT_TYPES = [
  { value: "building", label: "Building Permit" },
  { value: "electrical", label: "Electrical Permit" },
  { value: "solar", label: "Solar Installation" },
  { value: "plumbing", label: "Plumbing Permit" },
  { value: "hvac", label: "HVAC Permit" },
  { value: "roofing", label: "Roofing Permit" },
] as const

// Office types
export const OFFICE_TYPES = [
  { value: "county", label: "County" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "township", label: "Township" },
] as const

// Permit statuses
export const PERMIT_STATUSES = [
  { value: "draft", label: "Draft", color: "gray" },
  { value: "submitted", label: "Submitted", color: "blue" },
  { value: "under_review", label: "Under Review", color: "yellow" },
  { value: "approved", label: "Approved", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" },
] as const

// Search radius options (in miles)
export const SEARCH_RADIUS_OPTIONS = [
  { value: 5, label: "5 miles" },
  { value: 10, label: "10 miles" },
  { value: 25, label: "25 miles" },
  { value: 50, label: "50 miles" },
  { value: 100, label: "100 miles" },
] as const

// Default map settings
export const MAP_CONFIG = {
  defaultZoom: 10,
  defaultCenter: { lat: 39.8283, lng: -98.5795 }, // Center of US
  maxZoom: 18,
  minZoom: 3,
} as const