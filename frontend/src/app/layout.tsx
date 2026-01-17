'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
