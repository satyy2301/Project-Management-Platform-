interface TaskStatsBarProps {
  total: number;
  pending: number;
  completed: number;
}

export function TaskStatsBar({ total, pending, completed }: TaskStatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="glass-panel rounded-xl px-4 py-3 text-center">
        <p className="text-2xl font-bold text-[var(--foreground)]">{total}</p>
        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Total</p>
      </div>
      <div className="glass-panel rounded-xl px-4 py-3 text-center">
        <p className="text-2xl font-bold text-amber-400">{pending}</p>
        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Pending</p>
      </div>
      <div className="glass-panel rounded-xl px-4 py-3 text-center">
        <p className="text-2xl font-bold text-emerald-400">{completed}</p>
        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Completed</p>
      </div>
    </div>
  );
}
