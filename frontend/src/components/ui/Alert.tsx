'use client';

import { AlertCircle, X } from 'lucide-react';

interface AlertProps {
  message: string;
  onDismiss?: () => void;
}

export function Alert({ message, onDismiss }: AlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-red-200"
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-red-300 hover:text-red-100 transition"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
