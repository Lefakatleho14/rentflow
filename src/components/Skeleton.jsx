export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="h-40 bg-surface" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-surface rounded w-3/4" />
        <div className="h-3 bg-surface rounded w-1/2" />
        <div className="h-6 bg-surface rounded w-1/3" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border animate-pulse">
      <div className="h-4 bg-surface rounded flex-1" />
      <div className="h-4 bg-surface rounded w-20" />
      <div className="h-4 bg-surface rounded w-16" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-card border border-border rounded-lg p-4 animate-pulse">
      <div className="h-3 bg-surface rounded w-2/3 mb-2" />
      <div className="h-6 bg-surface rounded w-1/2" />
    </div>
  );
}