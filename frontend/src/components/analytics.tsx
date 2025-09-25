"use client"

import { useEffect } from 'react'
import Script from 'next/script'

interface AnalyticsProps {
  measurementId?: string
}

export function Analytics({ measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID }: AnalyticsProps) {
  useEffect(() => {
    if (measurementId && !measurementId.includes('PLACEHOLDER')) {
      // Initialize GA
      if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as Window & { gtag: (...args: unknown[]) => void }).gtag('config', measurementId, {
          page_title: document.title,
          page_location: window.location.href,
        })
      }
    }
  }, [measurementId])

  // Don't render scripts if no measurement ID or placeholder ID
  if (!measurementId || measurementId.includes('PLACEHOLDER')) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}

// Helper function to track events
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', eventName, parameters)
  }
}