'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  getTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from '@/lib/api';
import { sortTasks } from '@/lib/sortTasks';
import { useDebounce } from '@/hooks/useDebounce';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { useToast } from '@/components/ui/Toast';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { AppHeader } from '@/components/layout/AppHeader';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm, type TaskFormData } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskEmptyState } from '@/components/tasks/TaskEmptyState';
import { TaskStatsBar } from '@/components/tasks/TaskStatsBar';
import { TaskSkeletonGrid } from '@/components/tasks/TaskSkeleton';
import { DeleteConfirmModal } from '@/components/tasks/DeleteConfirmModal';
import type { SortOption, Task, TaskFilter } from '@/types';

const emptyForm: TaskFormData = { title: '', description: '', dueDate: '' };

const FILTER_KEY = 'taskflow-filter';
const SORT_KEY = 'taskflow-sort';

function readFilter(): TaskFilter {
  if (typeof window === 'undefined') return 'all';
  const stored = localStorage.getItem(FILTER_KEY);
  if (stored === 'all' || stored === 'pending' || stored === 'completed') return stored;
  return 'all';
}

function readSort(): SortOption {
  if (typeof window === 'undefined') return 'newest';
  const stored = localStorage.getItem(SORT_KEY);
  if (stored === 'dueDate' || stored === 'newest' || stored === 'title') return stored;
  return 'newest';
}

export default function Dashboard() {
  const router = useRouter();
  const { accessToken, user, logout, isInitialized } = useAuthStore();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setFilter(readFilter());
    setSort(readSort());
  }, []);

  const counts = useMemo(
    () => ({
      all: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'pending').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
    }),
    [allTasks],
  );

  const sortedTasks = useMemo(() => sortTasks(tasks, sort), [tasks, sort]);

  const loadTasks = useCallback(async () => {
    setError('');
    try {
      const status = filter === 'all' ? undefined : filter;
      const searchQuery = debouncedSearch || undefined;
      const [filtered, all] = await Promise.all([
        getTasks(status, searchQuery),
        getTasks(undefined, searchQuery),
      ]);
      setTasks(filtered);
      setAllTasks(all);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch, toast]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!accessToken) {
      router.push('/login');
      return;
    }
    setLoading(true);
    loadTasks();
  }, [accessToken, isInitialized, router, loadTasks]);

  const handleFilterChange = (f: TaskFilter) => {
    setFilter(f);
    localStorage.setItem(FILTER_KEY, f);
  };

  const handleSortChange = (s: SortOption) => {
    setSort(s);
    localStorage.setItem(SORT_KEY, s);
  };

  const openCreateForm = useCallback(() => {
    setEditingTask(null);
    setFormData(emptyForm);
    setShowForm(true);
  }, []);

  useKeyboardShortcut('n', openCreateForm, !showForm && !deleteTarget);

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (data: TaskFormData) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        title: data.title,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
        toast.success('Task updated');
      } else {
        await createTask(payload);
        toast.success('Task created');
      }
      closeForm();
      await loadTasks();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save task';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const previousStatus = task.status;
    const optimisticStatus = previousStatus === 'completed' ? 'pending' : 'completed';

    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: optimisticStatus } : t)),
    );
    setAllTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: optimisticStatus } : t)),
    );

    try {
      await completeTask(task.id);
      toast.success(optimisticStatus === 'completed' ? 'Task completed' : 'Task marked pending');
      await loadTasks();
    } catch (err: unknown) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: previousStatus } : t)),
      );
      setAllTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: previousStatus } : t)),
      );
      const message = err instanceof Error ? err.message : 'Failed to update task';
      toast.error(message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const removed = deleteTarget;
    setDeleting(true);

    setTasks((prev) => prev.filter((t) => t.id !== removed.id));
    setAllTasks((prev) => prev.filter((t) => t.id !== removed.id));

    try {
      await deleteTask(removed.id);
      setDeleteTarget(null);
      toast.success('Task deleted');
    } catch (err: unknown) {
      setTasks((prev) => [...prev, removed]);
      setAllTasks((prev) => [...prev, removed]);
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!isInitialized || !accessToken) {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-screen ambient-bg bg-[var(--background)]">
      <AppHeader email={user?.email} onNewTask={openCreateForm} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4">
            <Alert message={error} onDismiss={() => setError('')} />
          </div>
        )}

        <TaskStatsBar total={counts.all} pending={counts.pending} completed={counts.completed} />

        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={handleFilterChange}
          sort={sort}
          onSortChange={handleSortChange}
          counts={counts}
        />

        {loading ? (
          <TaskSkeletonGrid />
        ) : sortedTasks.length === 0 ? (
          <TaskEmptyState onCreateTask={openCreateForm} hasSearch={!!debouncedSearch} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={openEditForm}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>

      <Modal
        open={showForm}
        onClose={closeForm}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          initialData={formData}
          isEditing={!!editingTask}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <DeleteConfirmModal
        open={!!deleteTarget}
        taskTitle={deleteTarget?.title ?? ''}
        deleting={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
