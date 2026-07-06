type Status = "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED";
type Role = "USER" | "ADMIN" | "TEACHER" | "STUDENT";

interface User {
  id?: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin?: string | null;
  createdAt?: string;
  updatedAt?: string;
  avatarUrl?: string;
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
  icon: React.ReactNode;
  title: string;
  desc: string;
  path: string;
  accent: string;
  bgAccent: string;
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
  statusCode: number;
}

type SortOrder = "asc" | "desc";

interface UserFilters {
  page: number;
  limit: number;
  role?: Role | "";
  status?: Status | "";
  sortBy?: string;
  order?: SortOrder;
  search?: string;
}

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: Role;
  status: Status;
}

interface Student {
  id: number;
  userId?: number | null;
  fullName: string;
  rollNumber: string;
  grade?: string | null;
  section?: string | null;
  guardianName?: string | null;
  guardianContact?: string | null;
  enrolledAt: string;
  createdBy?: number | null;
  status: Status; // reuses existing user_status enum
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

interface StudentFilters {
  page?: number;
  limit?: number;
  grade?: string;
  section?: string;
  status?: Status | "";
  sortBy?: string;
  order?: SortOrder;
  search?: string;
}

interface StudentFormData {
  fullName: string;
  rollNumber: string;
  grade: string | null;
  section: string | null;
  guardianName?: string;
  guardianContact?: string;
  status: Status;
}
