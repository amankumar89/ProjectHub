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

type TasksApiResponse = ApiResponse<Paginated<Note, "tasks">>;

const fetchNotes = async (filters: Partial<NotesQueryParams>) => {
  const { data } = await api.get<TasksApiResponse>("/notes", {
    params: filters,
  });
  return data?.data;
};

const fetchNoteById = async (id: number) => {
  const { data } = await api.get<ApiResponse<Note>>(`/notes/${id}`);
  return data.data;
};

const createNoteRequest = async (payload: CreateNoteInput) => {
  const { data } = await api.post<ApiResponse<Note>>("/notes", payload);
  return data.data;
};

const updateNoteRequest = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateNoteInput;
}) => {
  const { data } = await api.put<ApiResponse<Note>>(`/notes/${id}`, payload);
  return data.data;
};

const deleteNoteRequest = async (id: number) => {
  const { data } = await api.delete<ApiResponse<void>>(`/notes/${id}`);
  return data;
};

// ---- hooks ----

export const useNotes = (filters: Partial<NotesQueryParams>) => {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => fetchNotes(filters),
    placeholderData: keepPreviousData,
  });
};

export const useNote = (id: number | undefined) => {
  return useQuery({
    queryKey: [TASKS_KEY, id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNoteRequest,
    onSuccess: () => {
      toast.success("Note created successfully");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to create note");
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNoteRequest,
    onSuccess: (updated) => {
      toast.success("Note updated successfully");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
      queryClient.setQueryData([TASKS_KEY, updated.id], updated);
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to update note");
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNoteRequest,
    onSuccess: () => {
      toast.success("Note deleted successfully");
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || "Failed to delete note");
    },
  });
};
