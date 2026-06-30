import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  setAuth: (user: User, token: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      setToken: (token) =>
        set({
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
