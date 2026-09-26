'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getTasks, createTask, updateTask, completeTask, deleteTask } from '@/lib/api';
import type { Task, TaskFilter } from '@/types';

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
}

const emptyForm: TaskFormData = { title: '', description: '', dueDate: '' };

export default function Dashboard() {
  const router = useRouter();
  const { accessToken, user, logout, isInitialized } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadTasks = useCallback(async () => {
    setError('');
    try {
      const status = filter === 'all' ? undefined : filter;
      const data = await getTasks(status);
      setTasks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!accessToken) {
      router.push('/login');
      return;
    }
    setLoading(true);
    loadTasks();
  }, [accessToken, isInitialized, router, loadTasks]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        dueDate: formData.dueDate || undefined,
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }
      closeForm();
      await loadTasks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (taskId: string) => {
    setError('');
    try {
      await completeTask(taskId);
      await loadTasks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  const handleDelete = async (taskId: string) => {
    setError('');
    try {
      await deleteTask(taskId);
      setDeleteConfirmId(null);
      await loadTasks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'No due date';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isInitialized || !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              + Add Task
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="mb-4 rounded-lg bg-red-950 border border-red-900 p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'completed'] as TaskFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-lg">No tasks yet</p>
            <p className="text-slate-500 text-sm mt-2">Create your first task to get started</p>
            <button
              onClick={openCreateForm}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Add Task
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`font-semibold text-white ${
                      task.status === 'completed' ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                      task.status === 'completed'
                        ? 'bg-green-900/50 text-green-300 border border-green-800'
                        : 'bg-yellow-900/50 text-yellow-300 border border-yellow-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {task.description && (
                  <p className="text-sm text-slate-400 line-clamp-3">{task.description}</p>
                )}

                <p className="text-xs text-slate-500">Due: {formatDate(task.dueDate)}</p>

                <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-slate-700">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="text-xs px-3 py-1.5 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 transition"
                  >
                    {task.status === 'completed' ? 'Mark Pending' : 'Complete'}
                  </button>
                  <button
                    onClick={() => openEditForm(task)}
                    className="text-xs px-3 py-1.5 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 transition"
                  >
                    Edit
                  </button>
                  {deleteConfirmId === task.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-xs px-3 py-1.5 bg-red-700 text-white rounded hover:bg-red-600 transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-xs px-3 py-1.5 bg-slate-700 text-slate-200 rounded hover:bg-slate-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(task.id)}
                      className="text-xs px-3 py-1.5 bg-red-900/50 text-red-300 rounded hover:bg-red-900 transition"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-20 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingTask ? 'Edit Task' : 'New Task'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {submitting ? 'Saving...' : editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
