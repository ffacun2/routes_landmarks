'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@/lib/context/user-context'
import MapComponent from '@/components/map-component'
import RouteDetails from '@/components/route-details'
import Backbutton from '@/components/backbutton'

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

export default function ViewRoutePage() {
  const params = useParams()
  const routeId = params.id as string
  const [route, setRoute] = useState<Route | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedLandmarks, setEditedLandmarks] = useState<Landmark[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const { username } = useUser()
  const router = useRouter()

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(`/api/routes/${routeId}`)
        if (!response.ok) throw new Error('Route not found')
        const data = await response.json()
        setRoute(data)
        setEditedName(data.name)
        setEditedLandmarks(data.landmarks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load route')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoute()
  }, [routeId])

  const handleSaveEdits = async () => {
    if (!editedName.trim()) {
      setError('Route name cannot be empty')
      return
    }

    if (editedLandmarks.length < 2) {
      setError('Route must have at least 2 landmarks')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/routes/${routeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          landmarks: editedLandmarks,
        }),
      })

      if (!response.ok) throw new Error('Failed to save changes')

      const updated = await response.json()
      setRoute(updated)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveLandmark = (id: string) => {
    const updated = editedLandmarks.filter(l => l.id !== id)
    setEditedLandmarks(updated.map((l, idx) => ({ ...l, order: idx })))
  }

  const handleReorderLandmarks = (newOrder: Landmark[]) => {
    setEditedLandmarks(newOrder.map((l, idx) => ({ ...l, order: idx })))
  }

  const handleUpdateLandmark = (id: string, updates: Partial<Landmark>) => {
    setEditedLandmarks(editedLandmarks.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const handleCancelEdit = () => {
    if (route) {
      setEditedName(route.name)
      setEditedLandmarks(route.landmarks)
      setIsEditing(false)
      setError('')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !route) {
    return (
      <main className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-error text-lg">{error}</p>
          <button
            onClick={() => router.push('/view-route')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
          >
            Back to Search
          </button>
        </div>
      </main>
    )
  }

  if (!route) return null

  const isAuthor = username === route.author

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <Backbutton/>
      <header className="flex justify-center z-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isEditing ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                maxLength={50}
                className="text-2xl font-bold text-text-primary px-3 py-1 border-2 border-primary rounded"
              />
            ) : (
              <h1 className="text-3xl font-bold text-text-primary truncate">{route.name}</h1>
            )}
          </div>
          
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 bg-error/10 text-error rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl border-2 border-border overflow-hidden shadow-lg">
              <MapComponent landmarks={isEditing ? editedLandmarks : route.landmarks} />
            </div>
          </div>

          <div>
            <div className='pb-4'>
            {isEditing ? (
              <div className='flex justify-around'>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 w-40 bg-surface-secondary cursor-pointer text-text-primary font-semibold rounded-lg hover:bg-border transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdits}
                  disabled={isSaving}
                  className="px-4 py-2 bg-success w-40 text-white cursor-pointer font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              isAuthor && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-accent w-full text-white cursor-pointer font-semibold rounded-lg hover:opacity-90 transition-colors"
                >
                  Edit Route
                </button>
              )
            )}
            </div>
            {/* Details */}
            <RouteDetails
              route={route}
              isEditing={isEditing}
              editedLandmarks={editedLandmarks}
              onRemoveLandmark={handleRemoveLandmark}
              onReorderLandmarks={handleReorderLandmarks}
              onUpdateLandmark={handleUpdateLandmark}
              />
          </div>
        </div>
      </div>
    </main>
  )
}
