export interface Landmark {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  order: number
}

export interface Route {
  id: string
  name: string
  landmarks: Landmark[]
  createdAt: string
}
