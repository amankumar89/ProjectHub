import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "TEACHER" | "STUDENT";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),

      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),

      setLoading: (val) => set({ isLoading: val }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
