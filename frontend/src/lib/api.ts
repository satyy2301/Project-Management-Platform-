import Cookies from 'js-cookie';
import { useAuthStore } from '@/store/authStore';
import type { CreateTaskInput, Task, UpdateTaskInput } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  skipAuth?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokensOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = useAuthStore.getState().refreshSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiCall<T = unknown>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { method = 'GET', body, skipAuth = false } = options;

  const makeRequest = async (): Promise<Response> => {
    const token = useAuthStore.getState().accessToken || Cookies.get('access_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token && !skipAuth) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fetchOptions: RequestInit = { method, headers };
    if (body !== undefined) {
      fetchOptions.body = JSON.stringify(body);
    }

    return fetch(`${API_URL}${endpoint}`, fetchOptions);
  };

  let response = await makeRequest();

  if (response.status === 401 && !skipAuth) {
    const refreshed = await refreshTokensOnce();
    if (refreshed) {
      response = await makeRequest();
    } else {
      await useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const text = await response.text();
    let errorMessage = 'API call failed';
    try {
      const error = JSON.parse(text);
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getTasks(status?: 'pending' | 'completed', search?: string): Promise<Task[]> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  const query = params.toString();
  return apiCall<Task[]>(`/tasks${query ? `?${query}` : ''}`);
}

export function createTask(input: CreateTaskInput): Promise<Task> {
  return apiCall<Task>('/tasks', { method: 'POST', body: input });
}

export function updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
  return apiCall<Task>(`/tasks/${id}`, { method: 'PUT', body: input });
}

export function completeTask(id: string): Promise<Task> {
  return apiCall<Task>(`/tasks/${id}/complete`, { method: 'PATCH' });
}

export function deleteTask(id: string): Promise<{ message: string }> {
  return apiCall<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' });
}
