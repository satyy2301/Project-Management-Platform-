'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { accessToken, isInitialized, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;
    router.push(accessToken ? '/dashboard' : '/login');
  }, [accessToken, isInitialized, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        <p className="mt-4 text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
