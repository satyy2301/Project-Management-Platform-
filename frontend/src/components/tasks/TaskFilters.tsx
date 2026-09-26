'use client';

import { Search } from 'lucide-react';
import type { SortOption, TaskFilter } from '@/types';
interface TaskCounts {
  all: number;
  pending: number;
  completed: number;
}

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: TaskCounts;
}

const filters: TaskFilter[] = ['all', 'pending', 'completed'];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'title', label: 'Title A–Z' },
];

export function TaskFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  counts,
}: TaskFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-muted)] pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[rgba(17,24,39,0.8)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/40 focus:border-[var(--accent-cyan)] transition"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilterChange(f)}
              className={`interactive px-4 py-2 rounded-lg text-sm font-medium capitalize min-h-[40px] ${
                filter === f
                  ? 'bg-gradient-to-r from-[var(--accent-cyan)]/20 to-[var(--accent-violet)]/20 text-[var(--foreground)] border border-[var(--accent-cyan)]/30'
                  : 'bg-white/5 text-[var(--foreground-muted)] border border-[var(--glass-border)] hover:bg-white/10'
              }`}
            >
              {f}
              <span className="ml-1.5 text-xs opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort tasks"
          className="px-3 py-2 rounded-lg text-sm border border-[var(--glass-border)] bg-[rgba(17,24,39,0.8)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)]/40 min-h-[40px]"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
