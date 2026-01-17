import { create } from 'zustand';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const DEFAULT_CLIENT_ID = process.env.NEXT_PUBLIC_DEFAULT_CLIENT_ID;

interface AuthState {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, clientId: string, role?: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: any) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: false,
  error: null,

  initializeAuth: () => {
    const token = Cookies.get('auth_token');
    if (token) {
      set({ token });
    }
  },

  setToken: (token: string) => {
    Cookies.set('auth_token', token, { expires: 7 });
    set({ token });
  },

  setUser: (user: any) => {
    set({ user });
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Login failed');
      }

      const data = await response.json();
      Cookies.set('auth_token', data.token, { expires: 7 });
      set({ token: data.token, user: data.user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, clientId: string, role?: string) => {
    set({ isLoading: true, error: null });
    try {
      const client_id = clientId || DEFAULT_CLIENT_ID;
      if (!client_id) {
        throw new Error('Missing client ID. Please set NEXT_PUBLIC_DEFAULT_CLIENT_ID or enter a valid UUID.');
      }
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, client_id, role }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Registration failed');
      }

      const data = await response.json();
      set({ user: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('auth_token');
    set({ token: null, user: null });
  },
}));
