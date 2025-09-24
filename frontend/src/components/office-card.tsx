"use client"

import { MapPin, Phone, Mail, Globe, Clock, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PermitOffice, Service } from "@/lib/types"
import { formatPhoneNumber, formatAddress, truncateText } from "@/lib/utils"

interface OfficeCardProps {
  office: PermitOffice
  services: Service[]
  distance?: number
  onGetDirections?: (office: PermitOffice) => void
  onViewDetails?: (office: PermitOffice) => void
}

export function OfficeCard({ 
  office, 
  services, 
  distance, 
  onGetDirections, 
  onViewDetails 
}: OfficeCardProps) {
  const hasContactInfo = office.phone || office.email || office.website

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{office.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{formatAddress(office.address, office.city, office.state, office.zipCode)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="secondary" className="capitalize">
              {office.type}
            </Badge>
            {distance && (
              <Badge variant="outline">
                {distance.toFixed(1)} miles
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        {hasContactInfo && (
          <div className="space-y-2">
            {office.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`tel:${office.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {formatPhoneNumber(office.phone)}
                </a>
              </div>
            )}
            {office.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={`mailto:${office.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {office.email}
                </a>
              </div>
            )}
            {office.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={office.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {truncateText(office.website.replace(/^https?:\/\//, ''), 30)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Office Hours */}
        {office.officeHours && (
          <div className="flex items-start gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Office Hours:</p>
              <p className="text-muted-foreground">{office.officeHours}</p>
            </div>
          </div>
        )}

        {/* Processing Time */}
        {office.processingTime && (
          <div className="text-sm">
            <span className="font-medium">Processing Time: </span>
            <span className="text-muted-foreground">{office.processingTime}</span>
          </div>
        )}

        {/* Online Portal */}
        {office.onlinePortal && (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            Online Portal Available
          </Badge>
        )}

        {/* Services */}
        {services.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Available Services:</p>
            <div className="flex flex-wrap gap-1">
              {services.slice(0, 3).map((service) => (
                <Badge key={service.id} variant="outline" className="text-xs">
                  {service.serviceType}
                </Badge>
              ))}
              {services.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{services.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onGetDirections?.(office)}
            className="flex-1"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Directions
          </Button>
          <Button 
            size="sm" 
            onClick={() => onViewDetails?.(office)}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}