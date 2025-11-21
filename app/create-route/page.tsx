'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/context/user-context'
import MapComponent from '@/components/map-component'
import LandmarksList from '@/components/landmarks-list'
import { v4 as uuidv4 } from 'uuid'
import Backbutton from '@/components/backbutton'

interface Landmark {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  order: number
}

interface SearchResult {
  id: string
  name: string
  description: string
  lat: number
  lng: number
}

export default function CreateRoute() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([])
  const [routeName, setRouteName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchError, setSearchError] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { username, userId } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!username) {
      router.push('/')
    }
  }, [username, router])

  const addLandmark = (lat: number, lng: number) => {
    const newLandmark: Landmark = {
      id: uuidv4(),
      name: `Landmark ${landmarks.length + 1}`,
      description: '',
      lat,
      lng,
      order: landmarks.length,
    }
    setLandmarks([...landmarks, newLandmark])
  }

  const updateLandmark = (id: string, updates: Partial<Landmark>) => {
    setLandmarks(landmarks.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  const removeLandmark = (id: string) => {
    const updated = landmarks.filter(l => l.id !== id)
    setLandmarks(updated.map((l, idx) => ({ ...l, order: idx })))
  }

  const reorderLandmarks = (newOrder: Landmark[]) => {
    setLandmarks(newOrder.map((l, idx) => ({ ...l, order: idx })))
  }

  const saveRoute = async () => {
    if (!routeName.trim()) {
      setError('Please enter a route name')
      return
    }

    if (landmarks.length < 2) {
      setError('Please add at least 2 landmarks')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const route = {
        id: uuidv4(),
        name: routeName,
        author: username,
        authorId: userId,
        landmarks,
        createdAt: new Date().toISOString(),
      }

      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route),
      })

      if (!response.ok) throw new Error('Failed to save route')

      const { routeId } = await response.json()
      router.push(`/view-route/${routeId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save route')
      setIsSaving(false)
    }
  }

  const handleSearchPlaces = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const query = searchQuery.trim()

    if (query.length < 3) {
      setSearchError('Please enter at least 3 characters')
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setSearchError('')

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`
      )

      if (!response.ok) {
        throw new Error('Search request failed')
      }

      const data = await response.json()
      const normalized: SearchResult[] = data.map((item: any) => ({
        id: item.place_id?.toString() ?? uuidv4(),
        name: item.display_name?.split(',')[0]?.trim() || 'Unnamed landmark',
        description: item.display_name || 'No description provided',
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }))

      setSearchResults(normalized)

      if (normalized.length === 0) {
        setSearchError('No locations found for that search')
      }
    } catch (err) {
      console.error('Geocoding error', err)
      setSearchError('Unable to search places right now. Please try again.')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const addSearchResultAsLandmark = (result: SearchResult) => {
    const newLandmark: Landmark = {
      id: uuidv4(),
      name: result.name,
      description: result.description,
      lat: result.lat,
      lng: result.lng,
      order: landmarks.length,
    }

    setLandmarks(prev => [...prev, newLandmark])
    setSearchQuery('')
    setSearchResults([])
    setSearchError('')
  }

  if (!username) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
     
      {/* Header */}
      <Backbutton/>
      <header className="flex justify-center">
            <h1 className="text-4xl font-bold text-text-primary">Create New Route</h1>   
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-2xl border-2 border-border overflow-hidden shadow-lg">
              <MapComponent landmarks={landmarks} onMapClick={addLandmark} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Route Details */}
            <div className="bg-surface rounded-2xl border-2 border-border p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">Route Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Route Name
                  </label>
                  <input
                    type="text"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="e.g., Downtown Walking Tour"
                    maxLength={50}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold text-text-primary mb-2">
                    Landmarks Added: {landmarks.length}
                  </p>
                  <p className="text-xs text-text-secondary">Click on the map to add new landmarks</p>
                </div>

                {error && <p className="text-error text-sm bg-error/10 p-2 rounded">{error}</p>}

                <button
                  onClick={saveRoute}
                  disabled={isSaving || landmarks.length < 2}
                  className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSaving ? 'Saving...' : 'Save Route'}
                </button>
              </div>
            </div>

            {/* Landmark Search */}
            <div className="bg-surface rounded-2xl border-2 border-border p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">Search Landmarks</h2>
              <form onSubmit={handleSearchPlaces} className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-text-primary mb-2">
                    Search by name or address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setSearchError('')
                      }}
                      placeholder="e.g., Eiffel Tower, Lima, Museum"
                      className="flex-1 px-3 py-2 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 disabled:opacity-50"
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  {searchError && <p className="text-error text-sm mt-2">{searchError}</p>}
                </div>
              </form>

              <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                {isSearching && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    Looking for places...
                  </div>
                )}

                {!isSearching && searchResults.length === 0 && !searchError && (
                  <p className="text-sm text-text-secondary">
                    Search powered by OpenStreetMap Nominatim. Try cities, museums, or addresses.
                  </p>
                )}

                {searchResults.map((result) => (
                  <div key={result.id} className="border border-border rounded-lg p-3 bg-surface-secondary">
                    <p className="text-sm font-semibold text-text-primary">{result.name}</p>
                    <p className="text-xs text-text-secondary mt-1">{result.description}</p>
                    <button
                      onClick={() => addSearchResultAsLandmark(result)}
                      className="mt-2 text-xs font-semibold px-3 py-1 rounded bg-primary text-white hover:bg-primary-light transition-colors"
                    >
                      Add to route
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Landmarks List */}
            <div className="bg-surface rounded-2xl border-2 border-border overflow-hidden">
              <LandmarksList
                landmarks={landmarks}
                onUpdateLandmark={updateLandmark}
                onRemoveLandmark={removeLandmark}
                onReorder={reorderLandmarks}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
