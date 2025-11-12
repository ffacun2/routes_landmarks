"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { Search } from "lucide-react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { useState } from "react"
import type { Landmark } from "@/src/lib/types"

interface MapContainerProps {
  landmarks: Landmark[]
  onMapClick?: (lat: number, lng: number) => void
  interactive?: boolean
}

export const MapContainer = forwardRef<any, MapContainerProps>(({ landmarks, onMapClick, interactive = true }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
  }))

  // Initialize map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current || mapRef.current) return

    const initMap = async () => {
      const L = (await import("leaflet")).default
      await import("leaflet/dist/leaflet.css")

      // Fix for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })

      const map = L.map(mapContainerRef.current!, {
        center: [40.4168, -3.7038], // Madrid, Spain
        zoom: 13,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map)

      if (interactive && onMapClick) {
        map.on("click", (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng)
        })
      }

      mapRef.current = map
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [interactive, onMapClick])

  // Update markers and route
  useEffect(() => {
    if (!mapRef.current) return

    const updateMapAsync = async () => {
      const L = (await import("leaflet")).default

      // Clear existing markers and polyline
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      if (polylineRef.current) {
        polylineRef.current.remove()
        polylineRef.current = null
      }

      if (landmarks.length === 0) return

      // Add markers
      const newMarkers = landmarks.map((landmark, index) => {
        const marker = L.marker([landmark.lat, landmark.lng])
          .addTo(mapRef.current)
          .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">
                  ${index + 1}. ${landmark.name}
                </h3>
                <p style="font-size: 12px; color: #666; margin: 0;">
                  ${landmark.description}
                </p>
              </div>
            `)
        return marker
      })
      markersRef.current = newMarkers

      // Draw route line
      if (landmarks.length > 1) {
        const latLngs = landmarks.map((l) => [l.lat, l.lng] as [number, number])
        polylineRef.current = L.polyline(latLngs, {
          color: "#2563eb",
          weight: 3,
          opacity: 0.7,
        }).addTo(mapRef.current)

        // Fit bounds to show all markers
        const bounds = L.latLngBounds(latLngs)
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
      } else {
        // Center on single marker
        mapRef.current.setView([landmarks[0].lat, landmarks[0].lng], 15)
      }
    }

    updateMapAsync()
  }, [landmarks])

  const handleSearch = async () => {
    if (!searchQuery.trim() || !mapRef.current) return

    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        const latitude = Number.parseFloat(lat)
        const longitude = Number.parseFloat(lon)

        mapRef.current.setView([latitude, longitude], 16)

        if (onMapClick) {
          onMapClick(latitude, longitude)
        }
      }
    } catch (error) {
      console.error("[v0] Error searching location:", error)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="relative w-full h-full">
      {interactive && (
        <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar ubicación..."
            className="bg-background shadow-lg"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={searching} className="shadow-lg">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  )
})

MapContainer.displayName = "MapContainer"
