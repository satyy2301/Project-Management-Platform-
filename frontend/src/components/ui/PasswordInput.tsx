'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
}

export function PasswordInput({ label, error, hint, id, className = '', ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id || 'password';

  return (
    <div className="relative">
      <Input
        id={inputId}
        label={label}
        error={error}
        hint={hint}
        type={visible ? 'text' : 'password'}
        className={`pr-12 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-[2.125rem] p-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] rounded"
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
