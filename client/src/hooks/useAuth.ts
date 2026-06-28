import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore, type User } from "../store/authStore";
import api from "../api/api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: { user: User; token: string } | User | null;
  token?: string;
}

const getMsg = (res: ApiResponse, fallback: string): string =>
  res?.message || fallback;

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      api.post<ApiResponse>("/auth/login", data).then((res) => res.data),

    onSuccess: (data) => {
      toast.success(getMsg(data, "Logged in successfully"));

      const { user, token } = data.data;

      if (!user) return;

      setAuth(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token,
      );
      navigate("/dashboard");
    },

    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      api.post<ApiResponse>("/auth/register", data).then((res) => res.data),

    onSuccess: (data) => {
      toast.success(getMsg(data, "Account created successfully"));
      navigate("/login");
    },

    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(msg);
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return { logout };
};
