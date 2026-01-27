import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/auth-storage";
import {
  saveToken,
  saveUser,
  clearAuth as clearAuthStorage,
  getUser,
  getToken,
} from "@/lib/auth-storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => {
        saveUser(user);
        set({ user, isAuthenticated: true });
      },

      setToken: (token) => {
        saveToken(token);
      },

      login: (user, token) => {
        saveToken(token);
        saveUser(user);
        set({
          user,
          isAuthenticated: true,
          error: null,
        });
      },

      logout: () => {
        clearAuthStorage();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      initializeAuth: () => {
        const token = getToken();
        const user = getUser();

        if (token && user) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "smipay-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

