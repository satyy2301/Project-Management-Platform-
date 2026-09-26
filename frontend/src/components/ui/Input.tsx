import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--foreground-muted)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full px-4 py-2.5 rounded-lg border border-[var(--glass-border)] bg-[rgba(17,24,39,0.8)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/40 focus:border-[var(--accent-cyan)] transition ${error ? 'border-red-500/50' : ''} ${className}`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-[var(--foreground-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className = '', ...props },
  ref,
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--foreground-muted)]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        className={`w-full px-4 py-2.5 rounded-lg border border-[var(--glass-border)] bg-[rgba(17,24,39,0.8)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/40 focus:border-[var(--accent-cyan)] transition resize-none ${error ? 'border-red-500/50' : ''} ${className}`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-[var(--foreground-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
