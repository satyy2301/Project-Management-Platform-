'use client';

import { LogOut, Plus } from 'lucide-react';
import { getGreeting } from '@/lib/formatDate';
import { Button } from '@/components/ui/Button';

interface AppHeaderProps {
  email?: string;
  onNewTask: () => void;
  onLogout: () => void;
}

export function AppHeader({ email, onNewTask, onLogout }: AppHeaderProps) {
  const initial = email?.charAt(0).toUpperCase() ?? '?';
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--glass-border)] glass-panel rounded-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-violet)] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-cyan-500/20"
            aria-hidden="true"
          >
            TF
          </div>
          <div>
            <h1
              className="text-xl font-bold brand-text leading-tight"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              TaskFlow
            </h1>
            {email && (
              <p className="text-sm text-[var(--foreground-muted)]">
                {greeting}, {email}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden sm:flex h-9 w-9 rounded-full bg-white/10 border border-[var(--glass-border)] items-center justify-center text-sm font-medium text-[var(--foreground)]"
            aria-label={`User avatar: ${email}`}
          >
            {initial}
          </div>
          <Button onClick={onNewTask} size="sm" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
          <Button onClick={onLogout} variant="ghost" size="sm" aria-label="Logout">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
