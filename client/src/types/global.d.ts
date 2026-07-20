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
  name: string;
  email: string | null;
  phone: string | null;
  enrolledAt: string;
  createdAt: Date;
  updatedAt: Date;
  studentId: string;
  isActive: boolean;
  addedBy: number;
}

interface StudentFilters {
  page?: number;
  limit?: number;
  grade?: string;
  section?: string;
  isActive?: boolean;
  sortBy?: string;
  order?: SortOrder;
  search?: string;
}

type StudentFormData = Partial<Student>;

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
type Paginated<T, K extends string = "data"> = {
  pagination: PaginationProps;
} & Record<K, T[]>;
