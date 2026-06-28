type Status = "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";
type Role = "USER" | "ADMIN" | "TEACHER" | "STUDENT";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface UserWithToken {
  user: User;
  token: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CardItem {
  icon: string;
  title: string;
  desc: string;
  path: string;
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

interface ApiError {
  message: string;
}
