/**
 * Loading States
 * Reusable loading skeleton components
 */

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-solid border-red-600 border-r-transparent`} />
  )
}

export function LoadingCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-white/10 rounded w-2/3"></div>
    </div>
  )
}

export function LoadingTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-1/4"></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-white/10 animate-pulse flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-3 bg-white/10 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  )
}

export function LoadingGrid({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: items }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

export function LoadingPage() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-white/10 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-white/10 rounded w-1/3"></div>
      </div>
      <LoadingGrid items={6} />
    </div>
  )
}
