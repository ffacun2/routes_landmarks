'use client'

import { useRouter } from 'next/navigation'
import SearchRouteForm from '@/components/search-route-form'
import Backbutton from '@/components/backbutton'

export default function ViewRoute() {
  const router = useRouter()

  const handleSearchRoute = (routeId: string) => {
    router.push(`/view-route/${routeId}`)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <Backbutton/>
      <header className="flex justify-center">
            <h1 className="text-4xl font-bold text-text-primary">View Route</h1>   
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchRouteForm onSearch={handleSearchRoute} />
      </div>
    </main>
  )
}
