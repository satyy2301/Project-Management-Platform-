'use client';

import { Calendar, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/types';
import { formatRelativeDueDate } from '@/lib/formatDate';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const dueDateColor: Record<string, string> = {
  overdue: 'text-red-400',
  soon: 'text-amber-400',
  default: 'text-[var(--foreground-muted)]',
  muted: 'text-[var(--foreground-muted)]',
};

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const due = formatRelativeDueDate(task.dueDate, task.status);
  const isCompleted = task.status === 'completed';

  const badgeVariant =
    due.variant === 'overdue' ? 'overdue' : isCompleted ? 'completed' : 'pending';

  return (
    <Card hoverLift className="flex flex-col gap-3 animate-slide-up">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className={`mt-0.5 h-5 w-5 shrink-0 rounded border-2 flex items-center justify-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)] ${
            isCompleted
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              : 'border-[var(--glass-border)] hover:border-[var(--accent-cyan)]'
          }`}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {isCompleted && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-semibold text-[var(--foreground)] truncate ${
                isCompleted ? 'line-through text-[var(--foreground-muted)]' : ''
              }`}
            >
              {task.title}
            </h3>
            <Badge variant={badgeVariant}>{task.status}</Badge>
          </div>

          {task.description && (
            <p className="text-sm text-[var(--foreground-muted)] line-clamp-2 mt-1">
              {task.description}
            </p>
          )}

          <div className={`flex items-center gap-1.5 mt-2 text-xs ${dueDateColor[due.variant]}`}>
            <Calendar className="h-3.5 w-3.5" />
            <span>{due.label}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-[var(--glass-border)]">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          aria-label={`Delete ${task.title}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </Card>
  );
}
