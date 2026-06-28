import { create } from "zustand";

type User = {
  id: string;
  name: string;
  role: "admin" | "user" | "student";
};

type AuthState = {
  user: User | null;
  token: string | null;

  login: (user: User, token: string) => void;
  logout: () => void;

  isAuthenticated: boolean;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  isAuthenticated: false,

  login: (user, token) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));

export default useAuthStore;
