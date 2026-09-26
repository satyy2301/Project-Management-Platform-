import type { Task } from '@/types';

export type DueDateVariant = 'default' | 'overdue' | 'soon' | 'muted';

export interface RelativeDueDate {
  label: string;
  variant: DueDateVariant;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function diffDays(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / msPerDay);
}

export function formatRelativeDueDate(
  dueDate?: string,
  status?: Task['status'],
): RelativeDueDate {
  if (!dueDate) {
    return { label: 'No due date', variant: 'muted' };
  }

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate));
  const days = diffDays(today, due);

  if (status === 'completed') {
    return {
      label: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      variant: 'muted',
    };
  }

  if (days < 0) {
    const overdue = Math.abs(days);
    return {
      label: overdue === 1 ? 'Overdue by 1 day' : `Overdue by ${overdue} days`,
      variant: 'overdue',
    };
  }

  if (days === 0) {
    return { label: 'Due today', variant: 'soon' };
  }

  if (days === 1) {
    return { label: 'Due tomorrow', variant: 'soon' };
  }

  if (days <= 7) {
    return { label: `Due in ${days} days`, variant: 'default' };
  }

  return {
    label: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    variant: 'default',
  };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
