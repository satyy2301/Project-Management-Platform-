import type { SortOption, Task } from '@/types';

export function sortTasks(tasks: Task[], sort: SortOption): Task[] {
  const sorted = [...tasks];

  switch (sort) {
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }
}
