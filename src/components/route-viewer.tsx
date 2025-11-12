"use client"

import { useEffect, useState } from "react"
import { MapContainer } from "@/src/components/map-container"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { MapPin, Share2, Calendar } from "lucide-react"
import toast from "react-hot-toast";
import { getRoute } from "@/src/app/actions/routes"
import Link from "next/link"
import type { Route } from "@/src/lib/types"

interface RouteViewerProps {
  routeId: string
}

export function RouteViewer({ routeId }: RouteViewerProps) {
  const [route, setRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoute = async () => {
      try {
        const result = await getRoute(routeId)
        if (result.success && result.route) {
          setRoute(result.route)
        } else {
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    loadRoute()
  }, [routeId])

  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast("El enlace ha sido copiado al portapapeles.")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando ruta...</p>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Ruta no encontrada</h2>
          <p className="text-muted-foreground mb-6">La ruta que buscas no existe o ha sido eliminada.</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">RouteShare</h1>
            </Link>

            <Button onClick={handleShare} size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">{route.name}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{route.landmarks.length} landmarks</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Creada el {new Date(route.createdAt).toLocaleDateString("es-ES")}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Itinerario</h3>
              <div className="space-y-3">
                {route.landmarks.map((landmark, index) => (
                  <div key={landmark.id} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm">{landmark.name}</h4>
                      {landmark.description && (
                        <p className="text-xs text-muted-foreground mt-1">{landmark.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-180px)] overflow-hidden">
              <MapContainer landmarks={route.landmarks} interactive={false} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
