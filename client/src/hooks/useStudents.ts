import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import api from "@/api/api";
import toast from "react-hot-toast";
import type {
  ApiResponse,
  Paginated,
  Student,
  StudentFilters,
  StudentFormData,
} from "@/types/global";

const STUDENTS_KEY = "students";

type StudentsApiResponse = ApiResponse<Paginated<Student, "students">>;

const fetchStudents = async (filters: StudentFilters) => {
  const { data } = await api.get<StudentsApiResponse>("/students", {
    params: filters,
  });
  return data.data;
};

const fetchStudentById = async (id: number) => {
  const { data } = await api.get<ApiResponse<Student>>(`/students/${id}`);
  return data.data;
};

const createStudentRequest = async (payload: StudentFormData) => {
  const { data } = await api.post<ApiResponse<Student>>("/students", payload);
  return data.data;
};

const updateStudentRequest = async ({
  id,
  payload,
}: {
  id: number;
  payload: Partial<StudentFormData>;
}) => {
  const { data } = await api.put<ApiResponse<Student>>(
    `/students/${id}`,
    payload,
  );
  return data.data;
};

const deleteStudentRequest = async (id: number) => {
  const { data } = await api.delete<ApiResponse<null>>(`/students/${id}`);
  return data;
};

// ---- hooks ----

export const useStudents = (filters: StudentFilters = {}) => {
  return useQuery({
    queryKey: [STUDENTS_KEY, filters],
    queryFn: () => fetchStudents(filters),
    placeholderData: keepPreviousData, // avoids list flicker when paging/filtering
  });
};

export const useStudent = (id: number | undefined) => {
  return useQuery({
    queryKey: [STUDENTS_KEY, id],
    queryFn: () => fetchStudentById(id!),
    enabled: !!id, // don't fire until a real id is selected (e.g. edit dialog closed)
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStudentRequest,
    onSuccess: () => {
      toast.success("Student created");
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentRequest,
    onSuccess: (updated) => {
      toast.success("Student updated");
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      queryClient.setQueryData([STUDENTS_KEY, updated.id], updated);
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudentRequest,
    onSuccess: () => {
      toast.success("Student deleted");
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
    },
  });
};
