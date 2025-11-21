'use client'

import { useState } from 'react'

interface SearchRouteFormProps {
  onSearch: (routeId: string) => void
}

export default function SearchRouteForm({ onSearch }: SearchRouteFormProps) {
  const [routeId, setRouteId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!routeId.trim()) {
      setError('Please enter a route ID')
      return
    }

    setError('')
    onSearch(routeId.trim())
  }

  return (
    <div className="bg-surface rounded-2xl border-2 border-border p-8">
      <h2 className="text-3xl font-bold text-text-primary mb-6">Find a Route</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="routeId" className="block text-sm font-semibold text-text-primary mb-3">
            Route ID
          </label>
          <input
            id="routeId"
            type="text"
            value={routeId}
            onChange={(e) => {
              setRouteId(e.target.value)
              setError('')
            }}
            placeholder="Paste the route ID here"
            className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors"
          />
          {error && <p className="text-error text-sm mt-2">{error}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-accent to-accent text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          View Route
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-border">
        <h3 className="font-semibold text-text-primary mb-3">How to find routes?</h3>
        <ul className="space-y-2 text-text-secondary text-sm">
          <li className="flex gap-2">
            <span>📋</span>
            <span>Ask the route creator for their route ID</span>
          </li>
          <li className="flex gap-2">
            <span>🔗</span>
            <span>The ID is shown when a route is saved</span>
          </li>
          <li className="flex gap-2">
            <span>✅</span>
            <span>Paste it here to view the complete route with all landmarks</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
