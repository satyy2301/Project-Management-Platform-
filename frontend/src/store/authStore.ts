import { create } from 'zustand';
import Cookies from 'js-cookie';
import type { User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
}

const setTokenCookies = (accessToken: string, refreshToken: string) => {
  Cookies.set('access_token', accessToken, { expires: 1 });
  Cookies.set('refresh_token', refreshToken, { expires: 7 });
};

const clearTokenCookies = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  setTokens: (accessToken, refreshToken) => {
    setTokenCookies(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },

  setUser: (user) => set({ user }),

  refreshSession: async () => {
    const refreshToken = get().refreshToken || Cookies.get('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      get().setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  },

  initializeAuth: async () => {
    const accessToken = Cookies.get('access_token') || null;
    const refreshToken = Cookies.get('refresh_token') || null;

    set({ accessToken, refreshToken });

    if (!accessToken && !refreshToken) {
      set({ isInitialized: true });
      return;
    }

    if (!accessToken && refreshToken) {
      const refreshed = await get().refreshSession();
      if (!refreshed) {
        clearTokenCookies();
        set({ accessToken: null, refreshToken: null, user: null, isInitialized: true });
        return;
      }
    }

    const token = get().accessToken;
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const user = await response.json();
        set({ user, isInitialized: true });
        return;
      }

      if (response.status === 401) {
        const refreshed = await get().refreshSession();
        if (refreshed) {
          const retry = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${get().accessToken}` },
          });
          if (retry.ok) {
            const user = await retry.json();
            set({ user, isInitialized: true });
            return;
          }
        }
      }
    } catch {
      // fall through to clear session
    }

    clearTokenCookies();
    set({ accessToken: null, refreshToken: null, user: null, isInitialized: true });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      get().setTokens(data.accessToken, data.refreshToken);
      set({ user: data.user, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Registration failed');
      }

      set({ isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    const token = get().accessToken;
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // ignore network errors on logout
      }
    }
    clearTokenCookies();
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
