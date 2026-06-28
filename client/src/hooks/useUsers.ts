import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/api";
import type { AxiosError } from "axios";

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// GET ALL
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      api.get<ApiResponse<UsersResponse>>("/users").then((res) => {
        const data: UsersResponse = res?.data?.data;
        return data;
      }),
  });
};

// GET BY ID
export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () =>
      api.get<ApiResponse<User>>(`/users/${id}`).then((res) => res.data),
    enabled: !!id,
  });
};

// UPDATE
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      api.put<ApiResponse<User>>(`/users/${id}`, data).then((res) => res.data),

    onSuccess: (res) => {
      toast.success(res.message || "User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to update user");
    },
  });
};

// DELETE
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
