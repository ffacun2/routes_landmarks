'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface UserContextType {
  userId: string | null
  username: string | null
  setUsername: (name: string) => void | Promise<void>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Clave para la base de datos de usuarios en localStorage
const USERS_DB_KEY = 'usersDatabase'

// Interfaz para la base de datos de usuarios
interface UsersDatabase {
  [username: string]: string // username -> userId
}

// Función para generar un userId determinístico basado en el username usando hash
async function generateUserIdFromUsername(username: string): Promise<string> {
  // Normalizar el username (trim y lowercase para consistencia)
  const normalized = username.trim().toLowerCase()
  
  // Crear un hash SHA-256 del username
  const encoder = new TextEncoder()
  const data = encoder.encode(normalized)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // Convertir el hash a formato UUID (8-4-4-4-12)
  const uuid = `${hashHex.substring(0, 8)}-${hashHex.substring(8, 12)}-${hashHex.substring(12, 16)}-${hashHex.substring(16, 20)}-${hashHex.substring(20, 32)}`
  
  return uuid
}

// Función para obtener o crear un userId para un username
async function getOrCreateUserId(username: string): Promise<string> {
  const normalized = username.trim().toLowerCase()
  
  // Cargar la base de datos de usuarios
  const dbJson = localStorage.getItem(USERS_DB_KEY)
  let usersDb: UsersDatabase = {}
  
  if (dbJson) {
    try {
      usersDb = JSON.parse(dbJson)
    } catch (error) {
      console.error('Error parsing users database:', error)
      usersDb = {}
    }
  }
  
  // Si el usuario ya existe en la base de datos, retornar su userId
  if (usersDb[normalized]) {
    return usersDb[normalized]
  }
  
  // Si no existe, generar un nuevo userId usando hash determinístico
  const newUserId = await generateUserIdFromUsername(normalized)
  
  // Guardar en la base de datos
  usersDb[normalized] = newUserId
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb))
  
  return newUserId
}

// Función para obtener el userId de un username (sin crear si no existe)
function getUserIdFromUsername(username: string): string | null {
  const normalized = username.trim().toLowerCase()
  const dbJson = localStorage.getItem(USERS_DB_KEY)
  
  if (!dbJson) return null
  
  try {
    const usersDb: UsersDatabase = JSON.parse(dbJson)
    return usersDb[normalized] || null
  } catch (error) {
    console.error('Error parsing users database:', error)
    return null
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [username, setUsernameState] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const storedUsername = localStorage.getItem('username')

    if (storedUsername) {
      setUsernameState(storedUsername)
      // Obtener el userId desde la base de datos de usuarios
      const existingUserId = getUserIdFromUsername(storedUsername)
      if (existingUserId) {
        setUserId(existingUserId)
      } else {
        // Si no existe, generarlo y guardarlo
        getOrCreateUserId(storedUsername).then(userId => {
          setUserId(userId)
        })
      }
    }

    setMounted(true)
  }, [])

  const setUsername = async (name: string) => {
    const trimmedName = name.trim()
    setUsernameState(trimmedName)
    localStorage.setItem('username', trimmedName)
    
    // Obtener o crear el userId para este username
    const userIdForUsername = await getOrCreateUserId(trimmedName)
    setUserId(userIdForUsername)
    // También guardar en userId para compatibilidad
    localStorage.setItem('userId', userIdForUsername)
  }

  const logout = () => {
    setUsernameState(null)
    setUserId(null)
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
  }

  return (
    <UserContext.Provider value={{ userId, username, setUsername, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
