import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)] text-white hover:opacity-90 shadow-lg shadow-cyan-500/20',
  ghost:
    'bg-transparent border border-[var(--glass-border)] text-[var(--foreground-muted)] hover:bg-white/5 hover:text-[var(--foreground)]',
  danger: 'bg-red-600/90 text-white hover:bg-red-600 border border-red-500/30',
  secondary:
    'bg-white/5 border border-[var(--glass-border)] text-[var(--foreground)] hover:bg-white/10',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg min-h-[36px]',
  md: 'px-4 py-2 text-sm rounded-lg min-h-[44px]',
  lg: 'px-6 py-3 text-base rounded-xl min-h-[48px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`interactive inline-flex items-center justify-center gap-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
