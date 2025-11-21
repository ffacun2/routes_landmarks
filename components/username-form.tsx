'use client'

import { useState } from 'react'
import { useUser } from '@/lib/context/user-context'

export default function UsernameForm() {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { setUsername } = useUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Please enter a username')
      return
    }

    if (name.trim().length < 2) {
      setError('Username must be at least 2 characters')
      return
    }

    setUsername(name.trim())
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary-lighter p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm mb-6">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7.971" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">RouteMapper</h1>
          <p className="text-white/80">Create and share amazing tourist routes</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-text-primary mb-3">
                Your Username
              </label>
              <input
                id="username"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError('')
                }}
                placeholder="Enter your username"
                maxLength={30}
                className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:outline-none transition-colors bg-surface text-text-primary placeholder:text-text-secondary"
              />
              {error && <p className="text-error text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r cursor-pointer from-primary to-primary-light text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              Continue
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-text-secondary text-sm text-center">
              Your username will appear as the author of your routes
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🗺️</div>
            <p className="text-white/80 text-xs">Create Routes</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📍</div>
            <p className="text-white/80 text-xs">Add Landmarks</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔗</div>
            <p className="text-white/80 text-xs">Share Links</p>
          </div>
        </div>
      </div>
    </main>
  )
}
