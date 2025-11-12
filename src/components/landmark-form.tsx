"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"

interface LandmarkFormProps {
  position: [number, number]
  onSubmit: (landmark: {
    name: string
    description: string
    lat: number
    lng: number
  }) => void
  onCancel: () => void
}

export function LandmarkForm({ position, onSubmit, onCancel }: LandmarkFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      lat: position[0],
      lng: position[1],
    })

    setName("")
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Torre Eiffel"
          required
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Breve descripción del lugar..."
          rows={3}
          className="mt-2"
        />
      </div>

      <div className="text-xs text-muted-foreground">
        <p>Coordenadas:</p>
        <p className="font-mono">
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">
          Agregar
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
