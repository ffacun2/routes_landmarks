"use client"

import { useEffect, useState } from "react"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { MapPin } from "lucide-react"
import { getAllRoutes } from "@/src/app/actions/routes"
import Link from "next/link"
import type { Route } from "@/src/lib/types"

export function RoutesList() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const result = await getAllRoutes()
        if (result.success && result.routes) {
          setRoutes(result.routes)
        }
      } catch (error) {
        console.error("Error loading routes:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRoutes()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Cargando rutas...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Explora Rutas</h2>
        <Link href="/create">
          <Button size="lg">Crear Nueva Ruta</Button>
        </Link>
      </div>

      {routes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Aún no hay rutas creadas.</p>
          <Link href="/create">
            <Button>Crea la primera ruta</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <Link key={route.id} href={`/route/${route.id}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <h3 className="text-xl font-semibold mb-3">{route.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {route.landmarks.length} landmarks
                  </p>
                  <p>Creada el {new Date(route.createdAt).toLocaleDateString("es-ES")}</p>
                </div>
                {route.landmarks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-medium mb-2">Primer destino:</p>
                    <p className="text-sm text-muted-foreground">{route.landmarks[0].name}</p>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
