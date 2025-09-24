// Core types for the Permit Office Finder application

export interface PermitOffice {
  id: string
  name: string
  description?: string
  address: string
  city: string
  state: string
  zipCode: string
  phone?: string
  email?: string
  website?: string
  latitude?: number
  longitude?: number
  hours?: Record<string, string>
  servicesOffered?: string[]
  permitTypes?: string[]
  createdAt: string
  updatedAt: string
  // Legacy fields for backward compatibility
  type?: 'county' | 'city' | 'state' | 'township'
  officeHours?: string
  processingTime?: string
  onlinePortal?: boolean
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface Service {
  id: string
  permitOfficeId: string
  serviceType: string
  description?: string
  requirements: string[]
  fees: Record<string, number | string>
  formsRequired: string[]
  processingDays?: number
  createdAt: string
}

export interface Permit {
  id: string
  userId: string
  permitOfficeId: string
  permitNumber?: string
  type: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  projectAddress: string
  projectDescription?: string
  estimatedValue?: number
  applicationData: Record<string, unknown>
  documents: string[]
  submittedAt?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  companyName?: string
  phone?: string
  role: 'user' | 'contractor' | 'admin'
  licenseNumber?: string
  preferences: Record<string, unknown>
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  query?: string
  permitType?: string
  officeType?: string
  state?: string
  city?: string
  radius?: number
  hasOnlinePortal?: boolean
  processingTime?: string
}

export interface SearchResult {
  office: PermitOffice
  distance?: number
  services: Service[]
}

export interface PermitOfficeWithDistance extends PermitOffice {
  distance?: number
  averageRating?: number
  reviewCount: number
}

export interface MapMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  title: string
  description?: string
  type: 'office' | 'user_location'
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  statusUpdates: boolean
  reminders: boolean
}