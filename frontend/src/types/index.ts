export interface User {
  id: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskFilter = 'all' | 'pending' | 'completed';

export type SortOption = 'dueDate' | 'newest' | 'title';

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
  dueDate?: string | null;
}
