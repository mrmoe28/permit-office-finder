import { SearchFilters, PermitOfficeWithDistance } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchResponse {
  offices: PermitOfficeWithDistance[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async searchPermitOffices(
    filters: SearchFilters,
    userLocation?: { lat: number; lng: number }
  ): Promise<ApiResponse<SearchResponse>> {
    const params = new URLSearchParams();

    // Add search filters to query params
    if (filters.query) params.append('search', filters.query);
    if (filters.permitType && filters.permitType !== 'all') {
      params.append('permitType', filters.permitType);
    }
    if (filters.officeType && filters.officeType !== 'all') {
      params.append('officeType', filters.officeType);
    }
    if (filters.city) params.append('city', filters.city);
    if (filters.state) params.append('state', filters.state);
    if (filters.radius) params.append('radius', filters.radius.toString());

    // Add user location for distance calculations
    if (userLocation) {
      params.append('userLat', userLocation.lat.toString());
      params.append('userLng', userLocation.lng.toString());
    }

    // Add pagination
    params.append('limit', '50'); // Get more results for better UX

    const queryString = params.toString();
    const endpoint = `/api/permit-offices${queryString ? `?${queryString}` : ''}`;

    return this.request<SearchResponse>(endpoint);
  }

  async getPermitOffice(id: string): Promise<ApiResponse<PermitOfficeWithDistance>> {
    return this.request<PermitOfficeWithDistance>(`/api/permit-offices/${id}`);
  }

  async getHealth(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();