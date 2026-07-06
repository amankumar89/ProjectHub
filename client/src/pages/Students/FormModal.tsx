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
import { GRADE_OPTIONS, SECTION_OPTIONS } from "@/utils/helper";
import { STATUS_OPTIONS } from "@/utils/helper";
import ModalActions from "@/components/ModalActions";

interface StudentFormModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

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
    defaultValues: {
      fullName: "",
      rollNumber: "",
      grade: "",
      section: "",
      guardianName: "",
      guardianContact: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (isEdit && studentData) {
      reset({
        fullName: studentData.fullName,
        rollNumber: studentData.rollNumber,
        grade: studentData.grade ?? "",
        section: studentData.section ?? "",
        guardianName: studentData.guardianName ?? "",
        guardianContact: studentData.guardianContact ?? "",
        status: studentData.status,
      });
    }
  }, [studentData, isEdit, reset]);

  useEffect(() => {
    if (!open || !isEdit) {
      reset({
        fullName: "",
        rollNumber: "",
        grade: "",
        section: "",
        guardianName: "",
        guardianContact: "",
        status: "ACTIVE",
      });
    }
  }, [open, isEdit, reset]);

  const onSubmit = (data: StudentFormData) => {
    if (isEdit) {
      updateStudent({ id, payload: data });
    } else {
      createStudent({ ...data });
    }
  };

  const handleClose = () => {
    reset();
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
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Enter Name"
                    className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                  />
                  {errors.fullName && (
                    <FieldError>{errors.fullName.message}</FieldError>
                  )}
                </FieldGroup>
              </FullSpan>

              <FullSpan>
                <FieldGroup>
                  <Label
                    htmlFor="rollNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Roll Number
                  </Label>
                  <Input
                    id="rollNumber"
                    placeholder="e.g. 2026-A-014"
                    className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                    {...register("rollNumber", {
                      required: "Roll number is required",
                    })}
                  />
                  {errors.rollNumber && (
                    <FieldError>{errors.rollNumber.message}</FieldError>
                  )}
                </FieldGroup>
              </FullSpan>

              <FieldGroup>
                <Label className="text-sm font-medium text-gray-700">
                  Grade
                </Label>
                <Select
                  value={watch("grade")}
                  onValueChange={(val) => setValue("grade", val)}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-400">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {GRADE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label className="text-sm font-medium text-gray-700">
                  Section
                </Label>
                <Select
                  value={watch("section")}
                  onValueChange={(val) => setValue("section", val)}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-400">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {SECTION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              <FieldGroup>
                <Label
                  htmlFor="guardianName"
                  className="text-sm font-medium text-gray-700"
                >
                  Guardian Name
                </Label>
                <Input
                  id="guardianName"
                  placeholder="Enter guardian name"
                  className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                  {...register("guardianName")}
                />
              </FieldGroup>

              <FieldGroup>
                <Label
                  htmlFor="guardianContact"
                  className="text-sm font-medium text-gray-700"
                >
                  Guardian Contact
                </Label>
                <Input
                  id="guardianContact"
                  placeholder="Phone or email"
                  className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                  {...register("guardianContact")}
                />
              </FieldGroup>

              <FieldGroup>
                <Label className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select
                  value={watch("status")}
                  onValueChange={(val) => setValue("status", val as Status)}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-400">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
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
