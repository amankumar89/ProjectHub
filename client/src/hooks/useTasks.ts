import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "@/api/api";
import toast from "react-hot-toast";

import type { AxiosError } from "axios";

const TASKS_KEY = "tasks";

type TasksApiResponse = ApiResponse<Paginated<Task, "tasks">>;

const fetchTasks = async (filters: Partial<TasksFiltersParams>) => {
  const { data } = await api.get<TasksApiResponse>("/tasks", {
    params: filters,
  });
  return data?.data;
};

const fetchTaskById = async (id: number) => {
  const { data } = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
  return data.data;
};

const createTask = async (payload: TaskFormDataProps) => {
  const { data } = await api.post<ApiResponse<Task>>("/tasks", payload);
  return data.data;
};

const updateTask = async ({
  id,
  payload,
}: {
  id: number;
  payload: TaskFormDataProps;
}) => {
  const { data } = await api.put<ApiResponse<Task>>(`/tasks/${id}`, payload);
  return data.data;
};

const deleteTasks = async (id: number) => {
  const { data } = await api.delete<ApiResponse<void>>(`/tasks/${id}`);
  return data;
};

export const useTasks = (filters: Partial<TasksFiltersParams>) => {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => fetchTasks(filters),
    placeholderData: keepPreviousData,
  });
};

export const useTaskById = (id: number | undefined) => {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: () => fetchTaskById(id!),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to create task");
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: (updated) => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.setQueryData([TASKS_KEY, updated.id], updated);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to update task");
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTasks,
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    },
  });
};
