import Link from 'next/link'
import RouteList from '@/components/route-list'

export default function Dashboard() {

  return (
    <main className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">Create Your First Route</h2>
          <p className="text-text-secondary text-lg">Build amazing tourist routes and share them with the world</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Create Route Card */}
          <Link href="/create-route">
            <div className="h-full bg-surface border-2 border-border rounded-2xl p-8 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary-light/20 transition-colors">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Create Route</h3>
              <p className="text-text-secondary">
                Start by placing landmarks on the map, adding descriptions, and creating your route
              </p>
            </div>
          </Link>

          {/* View Route Card */}
          <Link href="/view-route">
            <div className="h-full bg-surface border-2 border-border rounded-2xl p-8 hover:border-accent hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-accent/10 to-accent/10 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-accent/20 group-hover:to-accent/20 transition-colors">
                <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">View Route</h3>
              <p className="text-text-secondary">
                Enter a route ID to view existing routes created by you or others
              </p>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-surface-secondary rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-text-primary mb-4">How it works</h3>
          <div className="space-y-3 text-text-secondary">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">1</span>
              <p>Click "Create Route" and search or click on the map to add landmarks</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">2</span>
              <p>Add details like name, description, and reorder landmarks as needed</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">3</span>
              <p>Save your route and share the unique link with friends and travelers</p>
            </div>
          </div>
        </div>

        {/* Route List */}
        <div className="mb-12">
          <RouteList />
        </div>

      </div>
    </main>
  )
}
