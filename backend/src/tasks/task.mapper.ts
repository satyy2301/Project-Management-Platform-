import { Task } from '../entities/task.entity';

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export function toTaskResponse(task: Task): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    description: task.description ?? undefined,
    status: task.status,
    dueDate: task.due_date ? task.due_date.toISOString() : undefined,
    createdAt: task.created_at.toISOString(),
    updatedAt: task.updated_at.toISOString(),
  };
}
