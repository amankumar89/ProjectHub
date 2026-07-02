import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import type { AxiosError } from "axios";

const getMsg = (
  res: ApiResponse<User | UserWithToken | null>,
  fallback: string,
): string => res?.message || fallback;

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      api
        .post<ApiResponse<UserWithToken>>("/auth/login", data)
        .then((res) => res.data),

    onSuccess: (data) => {
      const { user, token } = data.data as UserWithToken;

      if (!user) return;
      toast.success(getMsg(data, "Logged in successfully"));

      setAuth(user, token);
      navigate("/dashboard");
    },

    onError: (error: AxiosError<ApiError>) => {
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
      api
        .post<ApiResponse<User>>("/auth/register", data)
        .then((res) => res.data),

    onSuccess: (data) => {
      toast.success(getMsg(data, "Account created successfully"));
      navigate("/login");
    },

    onError: (error: AxiosError<ApiError>) => {
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

  return useMutation({
    mutationFn: () =>
      api.get<ApiResponse<User>>("/auth/logout").then((res) => res.data),

    onSuccess: (data) => {
      clearAuth();
      toast.success(getMsg(data, "Logged out successfully"));
      navigate("/login");
    },

    onError: (error: AxiosError<ApiError>) => {
      const msg =
        error?.response?.data?.message || "Logout failed. Please try again.";
      toast.error(msg);
    },
  });
};

export const useProfile = () => {
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(["profile"]);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () =>
      await api.get<ApiResponse<User>>("/auth/me").then((res) => res.data.data),
    enabled: !cachedData,
    staleTime: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
  });
};
