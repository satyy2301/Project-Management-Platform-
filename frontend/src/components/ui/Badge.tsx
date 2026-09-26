type BadgeVariant = 'pending' | 'completed' | 'overdue' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  overdue: 'bg-red-500/15 text-red-300 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.15)]',
  default: 'bg-white/5 text-[var(--foreground-muted)] border-[var(--glass-border)]',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
