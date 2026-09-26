'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { ToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <ToastProvider>{children}</ToastProvider>;
}
