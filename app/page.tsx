'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/lib/context/user-context'
import UsernameForm from '@/components/username-form'
import Dashboard from '@/components/dashboard'

export default function Home() {
  const { username } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary to-primary-light">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return username ? <Dashboard /> : <UsernameForm />
}
