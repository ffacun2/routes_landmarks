"use server"

import { promises as fs } from "fs"
import path from "path"
import type { Route } from "@/src/lib/types"

const DATA_DIR = path.join(process.cwd(), "data")
const ROUTES_FILE = path.join(DATA_DIR, "routes.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read all routes from JSON file
async function readRoutes(): Promise<Route[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(ROUTES_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Write routes to JSON file
async function writeRoutes(routes: Route[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(ROUTES_FILE, JSON.stringify(routes, null, 2), "utf-8")
}

export async function saveRoute(route: Omit<Route, "id">) {
  try {
    const routes = await readRoutes()

    // Generate unique ID
    const id = `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newRoute: Route = {
      id,
      ...route,
    }

    routes.push(newRoute)
    await writeRoutes(routes)

    return { success: true, id }
  } catch (error) {
    console.error("[v0] Error saving route:", error)
    return { success: false, error: "Failed to save route" }
  }
}

export async function getRoute(id: string) {
  try {
    const routes = await readRoutes()
    const route = routes.find((r) => r.id === id)

    if (!route) {
      return { success: false, error: "Route not found" }
    }

    return { success: true, route }
  } catch (error) {
    console.error("[v0] Error getting route:", error)
    return { success: false, error: "Failed to get route" }
  }
}

export async function getAllRoutes() {
  try {
    const routes = await readRoutes()
    // Return routes sorted by creation date (newest first)
    const sortedRoutes = routes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { success: true, routes: sortedRoutes }
  } catch (error) {
    console.error("[v0] Error getting all routes:", error)
    return { success: false, error: "Failed to get routes" }
  }
}
