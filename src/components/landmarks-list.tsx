"use client"

import type React from "react"

import { useState } from "react"
import { GripVertical, Trash2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import type { Landmark } from "@/src/lib/types"

interface LandmarksListProps {
  landmarks: Landmark[]
  onDelete: (id: string) => void
  onReorder: (newOrder: Landmark[]) => void
}

export function LandmarksList({ landmarks, onDelete, onReorder }: LandmarksListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newLandmarks = [...landmarks]
    const draggedItem = newLandmarks[draggedIndex]
    newLandmarks.splice(draggedIndex, 1)
    newLandmarks.splice(index, 0, draggedItem)

    setDraggedIndex(index)
    onReorder(newLandmarks)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="space-y-2">
      {landmarks.map((landmark, index) => (
        <div
          key={landmark.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            flex items-start gap-3 p-3 bg-secondary/50 rounded-lg border border-border
            cursor-move hover:bg-secondary/70 transition-colors
            ${draggedIndex === index ? "opacity-50" : ""}
          `}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm text-foreground truncate">{landmark.name}</h4>
              {landmark.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{landmark.description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(landmark.id)}
            className="shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
