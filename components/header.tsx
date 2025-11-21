'use client'
import { useRouter } from 'next/navigation'
import { useUser } from '@/lib/context/user-context'

export default function Header() {
    const { username, logout } = useUser()
    const router = useRouter()

    // No mostrar el header hasta que el usuario esté cargado
    if (!username) {
        return null
    }

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    return(
    <header className="sticky top-0 z-400 bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.553-.894L9 7.971" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">RouteMapper</h1>
          </div>
          <div className="flex items-center gap-15">
            <div className="flex gap-2 text-right">
              <p className="text-m text-text-secondary">Welcome</p>
              <p className="text-m font-semibold text-text-primary">{username}</p>
          
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-text-primary hover:bg-surface-secondary rounded-2xl transition-colors text-m font-bold cursor-pointer border-2"
            >
              Logout
            </button>
          </div>
        </div>
    </header>
)}