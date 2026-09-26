import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TaskEmptyStateProps {
  onCreateTask: () => void;
  hasSearch?: boolean;
}

export function TaskEmptyState({ onCreateTask, hasSearch }: TaskEmptyStateProps) {
  return (
    <div className="text-center py-16 glass-panel rounded-2xl animate-fade-in">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-violet)]/20 border border-[var(--glass-border)] mb-4">
        <ClipboardList className="h-8 w-8 text-[var(--accent-cyan)]" />
      </div>
      <p className="text-lg text-[var(--foreground)] font-medium">
        {hasSearch ? 'No tasks match your search' : 'No tasks yet'}
      </p>
      <p className="text-[var(--foreground-muted)] text-sm mt-2 max-w-sm mx-auto">
        {hasSearch
          ? 'Try a different search term or clear the filter.'
          : 'Create your first task to get started organizing your work.'}
      </p>
      {!hasSearch && (
        <Button onClick={onCreateTask} className="mt-6">
          <Plus className="h-4 w-4" />
          Create your first task
        </Button>
      )}
    </div>
  );
}
