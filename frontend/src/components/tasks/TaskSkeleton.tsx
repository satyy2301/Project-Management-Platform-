export function TaskSkeleton() {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-3 w-24 rounded mt-2" />
      <div className="flex gap-2 pt-2 border-t border-[var(--glass-border)]">
        <div className="skeleton h-8 w-16 rounded-lg" />
        <div className="skeleton h-8 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function TaskSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </div>
  );
}
