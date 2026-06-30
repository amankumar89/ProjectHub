import { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useGetUserById, useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "@/utils/helper";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null; // null = create, number = edit
}

const UserFormModal: React.FC<UserFormModalProps> = ({ open, onClose, id }) => {
  const isEdit = id !== null;

  const { data: userData, isFetching: isFetchingUser } = useGetUserById(
    id ?? 0,
    { enabled: open && isEdit },
  );
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "USER",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (isEdit && userData) {
      reset({
        name: userData.name,
        email: userData.email,
        password: "",
        role: userData.role,
        status: userData.status,
      });
    }
  }, [userData, isEdit, reset]);

  // Reset to defaults when switching to create or modal closes
  useEffect(() => {
    if (!open || !isEdit) {
      reset({
        name: "",
        email: "",
        password: "",
        role: "USER",
        status: "ACTIVE",
      });
    }
  }, [open, isEdit, reset]);

  // ── Submit ──
  const onSubmit = (data: UserFormData) => {
    const payload: UserFormData = {
      ...data,
      password: data.password === "" ? undefined : data.password,
    };
    if (isEdit) {
      updateUser({ id, ...payload }, { onSuccess: onClose });
    } else {
      createUser(payload, { onSuccess: onClose });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit User" : "Create User"}
          </DialogTitle>
          <p className="text-sm text-gray-400">
            {isEdit
              ? "Update the user's details below."
              : "Fill in the details to add a new user."}
          </p>
        </DialogHeader>

        {/* Spinner while fetching user data in edit mode */}
        {isFetchingUser ? (
          <SpinnerOverlay>
            <Loader2 size={28} className="animate-spin text-indigo-500" />
            <p className="text-sm">Loading user details...</p>
          </SpinnerOverlay>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGrid className="px-6">
              {/* Name */}
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
                    placeholder="John Doe"
                    className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <FieldError>{errors.name.message}</FieldError>
                  )}
                </FieldGroup>
              </FullSpan>

              {/* Email */}
              <FullSpan>
                <FieldGroup>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                    {...register("email", {
                      required: "Email is required",
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
              </FullSpan>

              {/* Password */}
              <FullSpan>
                <FieldGroup>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password{" "}
                    {isEdit && (
                      <span className="text-gray-400 font-normal">
                        (leave blank to keep current)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder={isEdit ? "••••••••" : "Min. 8 characters"}
                    className="rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-100"
                    // {...register("password", {
                    //   required: isEdit ? false : "Password is required",
                    //   minLength: {
                    //     value: 4,
                    //     message: "Minimum 4 characters",
                    //   },
                    // })}
                  />
                  {errors.password && (
                    <FieldError>{errors.password.message}</FieldError>
                  )}
                </FieldGroup>
              </FullSpan>

              {/* Role */}
              <FieldGroup>
                <Label className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Select
                  value={watch("role")}
                  onValueChange={(val) => setValue("role", val as Role)}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-indigo-400">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {ROLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldGroup>

              {/* Status */}
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

            {/* Footer */}
            <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 mt-4 flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white min-w-24"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create User"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserFormModal;

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
