import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/api";
import type { AxiosError } from "axios";

type UsersApiResponse = ApiResponse<Paginated<User, "users">>;

export const useGetUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () =>
      api
        .get<UsersApiResponse>("/users", { params: filters })
        .then((res) => res.data?.data),
  });
};

// ─── GET BY ID ────────────────────────────────────────────────────────────────

export const useGetUserById = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () =>
      api.get<ApiResponse<User>>(`/users/${id}`).then((res) => res.data.data), // was: res.data (missing .data)
    enabled: options?.enabled ?? (!!id && id > 0),
  });
};

// ─── CREATE USER ──────────────────────────────────────────────────────────────

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: UserFormData, // was: ({ data }) — wrong shape
    ) => api.post<ApiResponse<User>>("/users", data).then((res) => res.data),

    onSuccess: (res) => {
      toast.success(res.message || "User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: AxiosError<ApiError>) => {
      toast.error(
        error?.response?.data?.message || "Failed to create user", // was: "Failed to update user"
      );
    },
  });
};

// ─── UPDATE USER ──────────────────────────────────────────────────────────────

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<UserFormData>) =>
      api
        .patch<ApiResponse<User>>(`/users/${id}`, data)
        .then((res) => res.data),

    onSuccess: (res) => {
      toast.success(res.message || "User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });
};

// ─── DELETE USER ──────────────────────────────────────────────────────────────

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete<ApiResponse<User>>(`/users/${id}`).then((res) => res.data),

    onSuccess: (res) => {
      toast.success(res.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    },
  });
};
