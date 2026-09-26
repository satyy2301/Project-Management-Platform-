'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value: ToastContextValue = {
    toast: {
      success: (message) => addToast(message, 'success'),
      error: (message) => addToast(message, 'error'),
    },
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 glass-panel rounded-xl px-4 py-3 animate-slide-up ${
              t.type === 'success' ? 'border-emerald-500/30' : 'border-red-500/30'
            }`}
            role="alert"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <p className="text-sm text-[var(--foreground)] flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
