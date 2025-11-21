'use client'

import { useEffect, useRef, useState } from 'react'

const getLeaflet = () => {
  if (typeof window === 'undefined') return null
  return (window as typeof window & { L?: any }).L ?? null
}

interface Landmark {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  order: number
}

interface MapComponentProps {
  landmarks: Landmark[]
  onMapClick?: (lat: number, lng: number) => void
}

export default function MapComponent({ landmarks, onMapClick }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<any>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const polylineRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!getLeaflet()) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      
      if (document.head) {
        document.head.appendChild(link)
      }

      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
      script.async = true
      script.onload = () => {
        // Add small delay to ensure DOM is ready
        setTimeout(() => setMapLoaded(true), 100)
      }
      script.onerror = () => {
        console.error('[v0] Failed to load Leaflet')
      }
      
      if (document.body) {
        document.body.appendChild(script)
      }
    } else {
      setTimeout(() => setMapLoaded(true), 100)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const leaflet = getLeaflet()
    if (!mapLoaded || !mapContainer.current || !leaflet || mapRef.current) return

    try {
      if (!mapContainer.current.offsetParent) {
        console.warn('[v0] Map container not visible, retrying...')
        setTimeout(() => setMapLoaded(true), 500)
        return
      }

      const newMap = leaflet.map(mapContainer.current).setView([20, 0], 2)
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(newMap)

      mapRef.current = newMap
      setMap(newMap)

      return () => {
        mapRef.current?.remove()
        mapRef.current = null
        setMap(null)
      }
    } catch (err) {
      console.error('[v0] Error initializing map:', err)
    }
  }, [mapLoaded])

  useEffect(() => {
    const leaflet = getLeaflet()
    if (!map || !leaflet) return

    const handleClick = (e: any) => {
      onMapClick?.(e.latlng.lat, e.latlng.lng)
    }

    if (onMapClick) {
      map.on('click', handleClick)
    }

    return () => {
      if (onMapClick) {
        map.off('click', handleClick)
      }
    }
  }, [map, onMapClick])

  useEffect(() => {
    const leaflet = getLeaflet()
    if (!map || !leaflet) return

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => {
        if (marker && map) {
          map.removeLayer(marker)
        }
      })
      markersRef.current = []

      if (polylineRef.current && map) {
        map.removeLayer(polylineRef.current)
        polylineRef.current = null
      }

      // Add new markers and create polyline
      if (landmarks.length > 0) {
        const sortedLandmarks = [...landmarks].sort((a, b) => a.order - b.order)
        const latLngs: [number, number][] = []

        sortedLandmarks.forEach((landmark, index) => {
          const marker = leaflet.circleMarker([landmark.lat, landmark.lng], {
            radius: 8,
            fillColor: '#1a472a',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          })
            .bindPopup(`<div class="text-sm"><strong>${landmark.name}</strong><br/>${landmark.description}</div>`)
            .addTo(map)

          markersRef.current.push(marker)
          latLngs.push([landmark.lat, landmark.lng])

          // Add order label
          const label = leaflet.marker([landmark.lat, landmark.lng], {
            icon: leaflet.divIcon({
              html: `<div style="background: #1a472a; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white;">${index + 1}</div>`,
              iconSize: [24, 24],
              className: 'text-marker',
            }),
          }).addTo(map)
          markersRef.current.push(label)
        })

        // Draw polyline connecting landmarks
        if (latLngs.length > 1) {
          polylineRef.current = leaflet.polyline(latLngs, {
            color: '#0066cc',
            weight: 2,
            opacity: 0.7,
            dashArray: '5, 5',
          }).addTo(map)
        }

        // Fit bounds
        const group = leaflet.featureGroup(markersRef.current)
        map.fitBounds(group.getBounds().pad(0.1))
      }
    } catch (err) {
      console.error(' Error updating landmarks:', err)
    }
  }, [map, landmarks])

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '500px' }} className="bg-gray-100" />
  )
}
