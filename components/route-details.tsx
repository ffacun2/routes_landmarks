'use client'

interface Landmark {
  id: string
  name: string
  description: string
  lat: number
  lng: number
  order: number
}

interface Route {
  id: string
  name: string
  author: string
  landmarks: Landmark[]
  createdAt: string
}

interface RouteDetailsProps {
  route: Route
  isEditing: boolean
  editedLandmarks?: Landmark[]
  onRemoveLandmark?: (id: string) => void
  onReorderLandmarks?: (landmarks: Landmark[]) => void
  onUpdateLandmark?: (id: string, updates: Partial<Landmark>) => void
}

export default function RouteDetails({
  route,
  isEditing,
  editedLandmarks,
  onRemoveLandmark,
  onReorderLandmarks,
  onUpdateLandmark,
}: RouteDetailsProps) {
  const landmarks = isEditing ? editedLandmarks || route.landmarks : route.landmarks
  const sorted = [...landmarks].sort((a, b) => a.order - b.order)
  const createdDate = new Date(route.createdAt).toLocaleDateString()

  const handleCopyId = () => {
    navigator.clipboard.writeText(route.id)
  }

  const handleShareLink = () => {
    const url = `${window.location.origin}/view-route/${route.id}`
    navigator.clipboard.writeText(url)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0 || !onReorderLandmarks) return
    const newOrder = [...sorted]
    ;[newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]]
    onReorderLandmarks(newOrder)
  }

  const handleMoveDown = (index: number) => {
    if (index === sorted.length - 1 || !onReorderLandmarks) return
    const newOrder = [...sorted]
    ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
    onReorderLandmarks(newOrder)
  }

  return (
    <div className="space-y-4">
      {/* Route Info */}
      <div className="bg-surface rounded-2xl border-2 border-border p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Route ID</p>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-sm font-mono bg-surface-secondary p-2 rounded flex-1 truncate">
                {route.id}
              </code>
              <button
                onClick={handleCopyId}
                className="px-3 py-2 bg-surface-secondary hover:bg-border rounded transition-colors text-sm font-medium cursor-pointer"
                title="Copy route ID"
              >
                📋
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs font-semibold text-text-secondary uppercase">Author</p>
            <p className="text-sm mt-1 font-medium text-text-primary">{route.author}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Created</p>
            <p className="text-sm mt-1 text-text-primary">{createdDate}</p>
          </div>

          <button
            onClick={handleShareLink}
            className="w-full mt-4 py-2 px-4 bg-gradient-to-r cursor-pointer from-primary to-primary-light text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Copy Share Link
          </button>
        </div>
      </div>

      {/* Landmarks List */}
      <div className="bg-surface rounded-2xl border-2 border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-bold text-text-primary">Landmarks ({sorted.length})</h3>
        </div>

        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {sorted.map((landmark, index) => (
            <div key={landmark.id} className={`p-4 ${isEditing ? 'bg-surface-secondary' : ''}`}>
              <div className="flex items-start gap-3 mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={landmark.name}
                      onChange={(e) => onUpdateLandmark?.(landmark.id, { name: e.target.value })}
                      maxLength={50}
                      className="w-full px-2 py-1 border border-border rounded font-semibold text-text-primary"
                    />
                  ) : (
                    <p className="font-semibold text-text-primary">{landmark.name}</p>
                  )}
                  <p className="text-xs text-text-secondary mt-1">
                    {landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <textarea
                  value={landmark.description}
                  onChange={(e) => onUpdateLandmark?.(landmark.id, { description: e.target.value })}
                  maxLength={200}
                  rows={2}
                  className="w-full text-sm px-2 py-1 border border-border rounded mb-2 resize-none"
                  placeholder="Description"
                />
              ) : landmark.description ? (
                <p className="text-sm text-text-secondary mt-2">{landmark.description}</p>
              ) : null}

              {isEditing && (
                <div className="flex gap-1 mt-2">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="text-xs py-1 px-2 bg-primary text-white hover:bg-primary-light disabled:opacity-50 rounded transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sorted.length - 1}
                    className="text-xs py-1 px-2 bg-primary text-white hover:bg-primary-light disabled:opacity-50 rounded transition-colors"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => onRemoveLandmark?.(landmark.id)}
                    className="text-xs py-1 px-2 bg-error/20 text-error hover:bg-error/30 rounded transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
