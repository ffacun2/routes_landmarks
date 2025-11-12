"use client"

import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { MapPin, LogIn, UserPlus, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"

export function Header() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">RouteShare</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          <Link href="/routes">
            <Button variant="ghost">Explorar Rutas</Button>
          </Link>
          <Link href="/create">
            <Button variant="ghost">Crear Ruta</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="gap-2 bg-transparent">
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/register">
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Registrarse
            </Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/routes" className="cursor-pointer">
                  Explorar Rutas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/create" className="cursor-pointer">
                  Crear Ruta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login" className="cursor-pointer">
                  Iniciar Sesión
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/register" className="cursor-pointer">
                  Registrarse
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
