"use client"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PERMIT_TYPES, OFFICE_TYPES, SEARCH_RADIUS_OPTIONS } from "@/lib/constants"
import { SearchFilters } from "@/lib/types"

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void
  isLoading?: boolean
}

export function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    permitType: "all",
    officeType: "all",
    radius: 25,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(filters)
  }

  const handleInputChange = (field: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Find Permit Offices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Search Input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter city, county, or address..."
              value={filters.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Permit Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Permit Type</label>
              <Select
                value={filters.permitType}
                onValueChange={(value) => handleInputChange("permitType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any permit type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any permit type</SelectItem>
                  {PERMIT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Office Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Office Type</label>
              <Select
                value={filters.officeType}
                onValueChange={(value) => handleInputChange("officeType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any office type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any office type</SelectItem>
                  {OFFICE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Radius */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Radius</label>
              <Select
                value={filters.radius?.toString()}
                onValueChange={(value) => handleInputChange("radius", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="25 miles" />
                </SelectTrigger>
                <SelectContent>
                  {SEARCH_RADIUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search Permit Offices
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}