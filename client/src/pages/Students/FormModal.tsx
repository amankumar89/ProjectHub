import { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  useStudent,
  useCreateStudent,
  useUpdateStudent,
} from "@/hooks/useStudents";
import ModalActions from "@/components/ModalActions";

interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  enrolledAt: string;
  isActive: boolean;
}

const EMPTY_FORM: StudentFormData = {
  name: "",
  email: "",
  phone: "",
  enrolledAt: "",
  isActive: true,
};

const FormModal: React.FC<StudentFormModalProps> = ({ open, onClose, id }) => {
  const isEdit = id !== null;

  const { data: studentData, isFetching: isFetchingStudent } = useStudent(id!);
  const { mutate: createStudent, isPending: isCreating } = useCreateStudent();
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (!open) return;

    if (isEdit && studentData) {
      reset({
        name: studentData.name,
        email: studentData.email ?? "",
        phone: studentData.phone ?? "",
        enrolledAt: studentData.enrolledAt
          ? String(studentData.enrolledAt).slice(0, 10)
          : "",
        isActive: studentData.isActive,
      });
    } else if (!isEdit) {
      reset(EMPTY_FORM);
    }
  }, [open, isEdit, studentData, reset]);

  const onSubmit = (data: StudentFormData) => {
    const payload = {
      name: data.name,
      email: data.email || undefined,
      phone: data.phone || undefined,
      enrolledAt: data.enrolledAt,
      isActive: isEdit ? data.isActive : undefined,
    };

    if (isEdit) {
      updateStudent({ id, payload });
    } else {
      createStudent(payload);
    }
  };

  const handleClose = () => {
    reset(EMPTY_FORM);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Student" : "Create Student"}
          </DialogTitle>
          <p className="text-sm text-gray-400">
            {isEdit
              ? "Update the student's details below."
              : "Fill in the details to enroll a new student."}
          </p>
        </DialogHeader>

        {isFetchingStudent ? (
          <SpinnerOverlay>
            <Loader2 size={28} className="animate-spin text-indigo-500" />
            <p className="text-sm">Loading student details...</p>
          </SpinnerOverlay>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGrid className="px-6">
              <FullSpan>
                <FieldGroup>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 150,
                        message: "Name must be under 150 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </FieldGroup>
              </FullSpan>

              <FieldGroup>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                  {...register("email", {
                    maxLength: {
                      value: 255,
                      message: "Email must be under 255 characters",
                    },
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </FieldGroup>

              <FieldGroup>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                  {...register("phone", {
                    maxLength: {
                      value: 20,
                      message: "Phone must be under 20 characters",
                    },
                  })}
                />
                {errors.phone && (
                  <FieldError>{errors.phone.message}</FieldError>
                )}
              </FieldGroup>

              <FieldGroup>
                <Label
                  htmlFor="enrolledAt"
                  className="text-sm font-medium text-gray-700"
                >
                  Enrolled At
                </Label>
                <Input
                  id="enrolledAt"
                  type="date"
                  className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                  {...register("enrolledAt", {
                    required: "Enrollment date is required",
                  })}
                />
                {errors.enrolledAt && (
                  <FieldError>{errors.enrolledAt.message}</FieldError>
                )}
              </FieldGroup>

              <FieldGroup>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={watch("isActive")}
                  onValueChange={(val: string | null) => {
                    setValue("isActive", val === "ACTIVE");
                  }}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-400">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {[
                      { label: "ACTIVE", value: "ACTIVE" },
                      { label: "INACTIVE", value: "INACTIVE" },
                    ].map((opt) => (
                      <SelectItem key={opt.label} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>
            </FormGrid>

            <ModalFooter>
              <ModalActions
                onCancel={handleClose}
                isLoading={isLoading}
                confirmLabel={isEdit ? "Save" : "Create"}
                confirmType="submit"
              />
            </ModalFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;

const FieldGroup = styled.div.attrs({
  className: "flex flex-col gap-1.5",
})``;

const FieldError = styled.p.attrs({
  className: "text-xs text-red-500 mt-0.5",
})``;

const FormGrid = styled.div.attrs({
  className: "grid grid-cols-1 sm:grid-cols-2 gap-4 py-2",
})``;

const FullSpan = styled.div.attrs({
  className: "sm:col-span-2",
})``;

const SpinnerOverlay = styled.div.attrs({
  className:
    "flex flex-col items-center justify-center py-16 gap-3 text-gray-400",
})``;

const ModalFooter = styled.div.attrs({
  className:
    "p-4 mt-2 bg-gray-50 border-t border-gray-100 flex gap-2 justify-end",
})``;
