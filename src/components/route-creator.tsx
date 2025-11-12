"use client"

import { useState, useCallback, useRef } from "react"
import { MapContainer } from "@/src/components/map-container"
import { LandmarksList } from "@/src/components/landmarks-list"
import { LandmarkForm } from "@/src/components/landmark-form"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card } from "@/src/components/ui/card"
import toast from "react-hot-toast";
import { Save, Share2 } from "lucide-react"
import { saveRoute } from "@/src/app/actions/routes"
import Link from "next/link"
import type { Landmark } from "@/src/lib/types"

export function RouteCreator() {
  const [routeName, setRouteName] = useState("")
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedRouteId, setSavedRouteId] = useState<string | null>(null)
//   const mapRef = useRef<any>(null)

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setSelectedPosition([lat, lng])
    setShowForm(true)
  }, [])

  const handleAddLandmark = useCallback(
    (landmark: Omit<Landmark, "id" | "order">) => {
      const newLandmark: Landmark = {
        ...landmark,
        id: crypto.randomUUID(),
        order: landmarks.length,
      }
      setLandmarks((prev) => [...prev, newLandmark])
      setSelectedPosition(null)
      setShowForm(false)
    },
    [landmarks.length],
  )

  const handleDeleteLandmark = useCallback(
    (id: string) => {
      setLandmarks((prev) => prev.filter((l) => l.id !== id).map((l, idx) => ({ ...l, order: idx })))
    },
    [],
  )

  const handleReorderLandmarks = useCallback((newOrder: Landmark[]) => {
    setLandmarks(newOrder.map((l, idx) => ({ ...l, order: idx })))
  }, [])

  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
      return
    }

    if (landmarks.length === 0) {
      return
    }

    setSaving(true)
    try {
      const result = await saveRoute({
        name: routeName,
        landmarks: landmarks,
        createdAt: new Date().toISOString(),
      })

      if (result.success && result.id) {
        setSavedRouteId(result.id)
        
      } else {
        throw new Error(result.error || "Error al guardar")
      }
    } catch (error) {
      
    } finally {
      setSaving(false)
    }
  }

  const handleCopyLink = () => {
    if (!savedRouteId) return
    const url = `${window.location.origin}/route/${savedRouteId}`
    navigator.clipboard.writeText(url)
    
  }

  return (
    <div className="bg-background">
      {/* Action Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/routes">
                <Button variant="outline" size="sm">
                  Ver Todas las Rutas
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              {savedRouteId ? (
                <>
                  <Link href={`/route/${savedRouteId}`}>
                    <Button variant="outline" size="sm">
                      Ver Ruta
                    </Button>
                  </Link>
                  <Button onClick={handleCopyLink} size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Copiar Enlace
                  </Button>
                </>
              ) : (
                <Button onClick={handleSaveRoute} disabled={saving} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Guardando..." : "Guardar Ruta"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Crear Nueva Ruta</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="route-name">Nombre de la Ruta</Label>
                  <Input
                    id="route-name"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="Ej: Tour por el Centro Histórico"
                    className="mt-2"
                  />
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Haz clic en el mapa para agregar landmarks o usa la búsqueda.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                      {landmarks.length}
                    </div>
                    <span className="text-foreground">
                      {landmarks.length === 1 ? "Landmark agregado" : "Landmarks agregados"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {showForm && selectedPosition && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Nuevo Landmark</h3>
                <LandmarkForm
                  position={selectedPosition}
                  onSubmit={handleAddLandmark}
                  onCancel={() => {
                    setShowForm(false)
                    setSelectedPosition(null)
                  }}
                />
              </Card>
            )}

            {landmarks.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Landmarks ({landmarks.length})</h3>
                <LandmarksList
                  landmarks={landmarks}
                  onDelete={handleDeleteLandmark}
                  onReorder={handleReorderLandmarks}
                />
              </Card>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-300px)] overflow-hidden">
              {/* <MapContainer landmarks={landmarks} onMapClick={handleMapClick} ref={mapRef} /> */}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
