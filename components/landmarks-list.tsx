'use client'

import { useMemo, useState } from 'react'

interface Landmark {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  order: number
}

interface LandmarksListProps {
  landmarks: Landmark[]
  onUpdateLandmark: (id: string, updates: Partial<Landmark>) => void
  onRemoveLandmark: (id: string) => void
  onReorder: (newOrder: Landmark[]) => void
}

export default function LandmarksList({
  landmarks,
  onUpdateLandmark,
  onRemoveLandmark,
  onReorder,
}: LandmarksListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sorted = useMemo(() => [...landmarks].sort((a, b) => a.order - b.order), [landmarks])

  const moveLandmark = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= sorted.length) return
    const reordered = [...sorted]
    const [item] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, item)
    onReorder(reordered)
  }

  const handleMoveUp = (index: number) => {
    moveLandmark(index, index - 1)
  }

  const handleMoveDown = (index: number) => {
    moveLandmark(index, index + 1)
  }

  return (
    <div className="p-4">
      <h3 className="font-bold text-text-primary mb-4">Landmarks ({sorted.length})</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sorted.length === 0 ? (
          <p className="text-text-secondary text-sm text-center py-4">No landmarks added yet. Click on the map to add landmarks.</p>
        ) : (
          sorted.map((landmark, index) => (
            <div key={landmark.id} className="border border-border rounded-lg p-3 bg-surface-secondary hover:bg-surface transition-colors">
              <div className="flex items-start gap-2 mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{landmark.name}</p>
                  <p className="text-xs text-text-secondary">{landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)}</p>
                </div>
              </div>

              {expandedId === landmark.id && (
                <div className="space-y-2 mb-3 pt-2 border-t border-border">
                  <input
                    type="text"
                    value={landmark.name}
                    onChange={(e) => onUpdateLandmark(landmark.id, { name: e.target.value })}
                    maxLength={50}
                    className="w-full text-xs px-2 py-1 border border-border rounded bg-surface"
                    placeholder="Landmark name"
                  />
                  <textarea
                    value={landmark.description}
                    onChange={(e) => onUpdateLandmark(landmark.id, { description: e.target.value })}
                    maxLength={200}
                    rows={2}
                    className="w-full text-xs px-2 py-1 border border-border rounded resize-none bg-surface"
                    placeholder="Description (optional)"
                  />
                </div>
              )}

              <div className="flex gap-1">
                <button
                  onClick={() => setExpandedId(expandedId === landmark.id ? null : landmark.id)}
                  className="flex-1 text-xs py-1 px-2 bg-surface hover:bg-border rounded transition-colors font-medium"
                >
                  {expandedId === landmark.id ? 'Done' : 'Edit'}
                </button>
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="text-xs py-1 px-2 bg-surface hover:bg-border disabled:opacity-50 rounded transition-colors font-medium"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === sorted.length - 1}
                  className="text-xs py-1 px-2 bg-surface hover:bg-border disabled:opacity-50 rounded transition-colors font-medium"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => onRemoveLandmark(landmark.id)}
                  className="text-xs py-1 px-2 bg-error/20 text-error hover:bg-error/30 rounded transition-colors font-medium"
                  title="Remove landmark"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
