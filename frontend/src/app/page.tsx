'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { FullPageSpinner } from '@/components/ui/Spinner';

export default function Home() {
  const router = useRouter();
  const { accessToken, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;
    router.push(accessToken ? '/dashboard' : '/login');
  }, [accessToken, isInitialized, router]);

  return <FullPageSpinner message="Loading..." />;
}
