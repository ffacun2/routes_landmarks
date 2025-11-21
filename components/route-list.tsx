'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/context/user-context'

interface Landmark {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  order: number
}

interface Route {
  id: string
  name: string
  author: string
  authorId: string
  landmarks: Landmark[]
  createdAt: string
}

export default function RouteList() {
  const { userId } = useUser()
  const router = useRouter()
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoutes = async () => {
      if (!userId) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        console.log("Usuario:",userId)
        const response = await fetch(`/api/routes?userId=${userId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch routes')
        }

        const data = await response.json()
        setRoutes(data.routes || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las rutas')
        console.error('Error fetching routes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoutes()
  }, [userId])

  const handleRouteClick = (routeId: string) => {
    router.push(`/view-route/${routeId}`)
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4 text-error text-center">
        {error}
      </div>
    )
  }

  if (routes.length === 0) {
    return (
      <div className="bg-surface-secondary rounded-2xl p-8 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-text-secondary text-lg">No tienes rutas creadas aún</p>
        <p className="text-text-secondary mt-2">¡Crea tu primera ruta para comenzar!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-text-primary mb-6">Mis Rutas</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => handleRouteClick(route.id)}
            className="bg-surface border-2 border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <h4 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                {route.name}
              </h4>
              <svg className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors flex-shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{route.landmarks.length} {route.landmarks.length === 1 ? 'punto' : 'puntos'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-text-secondary text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(route.createdAt)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-text-secondary text-sm line-clamp-2">
                {route.landmarks.length > 0 
                  ? `Ruta desde ${route.landmarks[0].name} hasta ${route.landmarks[route.landmarks.length - 1].name}`
                  : 'Ruta sin puntos'
                }
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

