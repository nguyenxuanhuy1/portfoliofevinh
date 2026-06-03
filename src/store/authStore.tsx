import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../features/shared/types/AuthState';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      setToken: (accessToken: string, refreshToken: string, role: string) => 
        set({ accessToken, refreshToken, role }),
      logout: () => set({ accessToken: null, refreshToken: null, role: null }),
    }),
    { name: 'auth-storage' }
  )
);