interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-5 w-5 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-2',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-transparent border-t-[var(--accent-cyan)] border-r-[var(--accent-violet)] ${sizeClasses[size]} ${className}`}
    />
  );
}

export function FullPageSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ambient-bg bg-[var(--background)]">
      <Spinner size="lg" />
      {message && <p className="mt-4 text-[var(--foreground-muted)]">{message}</p>}
    </div>
  );
}
