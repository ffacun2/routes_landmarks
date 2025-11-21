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
  const routingControlRef = useRef<any>(null) // Cambio: Referencia para el control de ruta

  // 1. CARGA DE SCRIPTS (Leaflet + Routing Machine)
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!getLeaflet()) {
      // Cargar CSS de Leaflet
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)

      // Cargar CSS de Routing Machine
      const linkRouting = document.createElement('link')
      linkRouting.rel = 'stylesheet'
      linkRouting.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.12/leaflet-routing-machine.css'
      document.head.appendChild(linkRouting)

      // Cargar JS de Leaflet
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
      script.async = true
      
      script.onload = () => {
        // Una vez cargado Leaflet, cargamos el JS de Routing Machine
        const scriptRouting = document.createElement('script')
        scriptRouting.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-routing-machine/3.2.12/leaflet-routing-machine.min.js'
        scriptRouting.async = true
        
        scriptRouting.onload = () => {
           setTimeout(() => setMapLoaded(true), 100)
        }
        document.body.appendChild(scriptRouting)
      }

      script.onerror = () => console.error('[v0] Failed to load Leaflet')
      document.body.appendChild(script)
    } else {
      setTimeout(() => setMapLoaded(true), 100)
    }
  }, [])

  // 2. INICIALIZACIÓN DEL MAPA (Igual que antes)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const leaflet = getLeaflet()
    // Verificamos también que exista Routing
    if (!mapLoaded || !mapContainer.current || !leaflet || !leaflet.Routing || mapRef.current) return

    try {
      if (!mapContainer.current.offsetParent) {
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

  // 3. EVENTOS CLICK (Igual que antes)
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

  // 4. DIBUJAR MARCADORES Y RUTA
  useEffect(() => {
    const leaflet = getLeaflet()
    if (!map || !leaflet || !leaflet.Routing) return

    try {
      // Limpiar marcadores existentes
      markersRef.current.forEach(marker => {
        if (marker && map) map.removeLayer(marker)
      })
      markersRef.current = []

      // Limpiar ruta anterior si existe
      if (routingControlRef.current && map) {
        map.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }

      if (landmarks.length > 0) {
        const sortedLandmarks = [...landmarks].sort((a, b) => a.order - b.order)
        
        // --- DIBUJAR RUTA (GPS) ---
        if (sortedLandmarks.length > 1) {
          const waypoints = sortedLandmarks.map(l => leaflet.latLng(l.lat, l.lng))

          routingControlRef.current = leaflet.Routing.control({
            waypoints: waypoints,
            // Estilo de la línea
            lineOptions: {
              styles: [{ color: '#0066cc', opacity: 0.7, weight: 5 }]
            },
            // Importante: Desactivar los marcadores por defecto del router
            createMarker: function() { return null; }, 
            addWaypoints: false, // No permitir arrastrar puntos
            draggableWaypoints: false,
            fitSelectedRoutes: false, // Lo haremos manualmente abajo
            show: false // Ocultar el cuadro de instrucciones (Turn-by-turn)
          }).addTo(map)
        }

        // --- DIBUJAR TUS MARCADORES PERSONALIZADOS ---
        // Mantenemos tu lógica original visual porque es mejor que la del router
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

          const label = leaflet.marker([landmark.lat, landmark.lng], {
            icon: leaflet.divIcon({
              html: `<div style="background: #1a472a; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white;">${index + 1}</div>`,
              iconSize: [24, 24],
              className: 'text-marker',
            }),
          }).addTo(map)
          markersRef.current.push(label)
        })

        // Ajustar zoom para ver todo
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