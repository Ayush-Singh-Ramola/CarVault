export function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function CarCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBlock className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <SkeletonBlock className="h-5 w-14" />
          <SkeletonBlock className="h-5 w-14" />
          <SkeletonBlock className="h-5 w-14" />
        </div>
        <SkeletonBlock className="h-6 w-1/3 mt-2" />
      </div>
    </div>
  );
}

export function CarGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkeletonBlock className="h-80" />
        <SkeletonBlock className="h-80" />
      </div>
    </div>
  );
}