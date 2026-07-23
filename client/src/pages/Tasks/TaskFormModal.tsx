import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";
import styled from "styled-components";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { useGetUsers } from "@/hooks/useUsers";
import Modal from "@/components/Modal";
import { useAuthStore } from "@/store/authStore";

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  open,
  onClose,
  task,
}) => {
  const { user } = useAuthStore();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { data, isLoading: usersLoading } = useGetUsers();
  const isSubmitting =
    createTaskMutation.isPending || updateTaskMutation.isPending;

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormDataProps>({
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: null,
      assignedTo: null,
    },
  });

  const currentUserId = user?.id;
  const users = data?.users ?? [];

  const assignedToValue = watch("assignedTo");

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        assignedTo: Number(task!.assignedTo!.id!),
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: null,
        assignedTo: null,
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: TaskFormDataProps) => {
    const payload: TaskFormDataProps = {
      ...data,
      dueDate: new Date(data.dueDate!),
      createdBy: currentUserId!,
      assignedTo: data.assignedTo! ?? currentUserId,
    };

    if (task?.id) {
      await updateTaskMutation.mutateAsync({ id: task.id, payload });
    } else {
      await createTaskMutation.mutateAsync(payload);
    }
    onClose();
  };

  const getSelectedUser = (userId: number | null) => {
    if (!userId) return null;
    return users.find((user: User) => user.id === userId);
  };

  const filteredUsers = users.filter(
    (user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user!.id!.toString().includes(searchTerm),
  );

  const selectedUser = getSelectedUser(assignedToValue!);

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task?.id ? "Edit Task" : "Create New Task"}
      isSubmitting={isSubmitting}
      saveText={task?.id ? "Update" : "Create"}
      onSave={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="overflow-auto">
        <FormGroup>
          <Label>Title *</Label>
          <Input
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
            placeholder="Enter task title..."
            disabled={isSubmitting}
          />
          {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Textarea
            {...register("description")}
            placeholder="Enter task description..."
            disabled={isSubmitting}
            rows={3}
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label>Status *</Label>
            <Select
              {...register("status", { required: "Status is required" })}
              disabled={isSubmitting}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </Select>
            {errors.status && <ErrorText>{errors.status.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>Priority *</Label>
            <Select
              {...register("priority", {
                required: "Priority is required",
              })}
              disabled={isSubmitting}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </Select>
            {errors.priority && (
              <ErrorText>{errors.priority.message}</ErrorText>
            )}
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>Due Date *</Label>
          <Input
            type="date"
            {...register("dueDate", {
              required: "Due date is required",
              validate: (value) => {
                if (value && new Date(value) < new Date()) {
                  return "Due date cannot be in the past";
                }
                return true;
              },
            })}
            disabled={isSubmitting}
          />
          {errors.dueDate && <ErrorText>{errors.dueDate.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Assign To</Label>
          <SearchContainer>
            <SearchInputWrapper>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search user by name or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                disabled={isSubmitting}
              />
              {selectedUser && (
                <SelectedUserTag>
                  <span>{selectedUser.name}</span>
                  <ClearButton
                    type="button"
                    onClick={() => {
                      setValue("assignedTo", null);
                      setSearchTerm("");
                    }}
                  >
                    ×
                  </ClearButton>
                </SelectedUserTag>
              )}
            </SearchInputWrapper>

            {isSearchOpen && !selectedUser && (
              <UserDropdown>
                {usersLoading ? (
                  <DropdownItem>Loading users...</DropdownItem>
                ) : filteredUsers.length === 0 ? (
                  <DropdownItem>No users found</DropdownItem>
                ) : (
                  filteredUsers.map((user: User) => (
                    <DropdownItem
                      key={user.id}
                      onClick={() => {
                        setValue("assignedTo", Number(user!.id));
                        setSearchTerm("");
                        setIsSearchOpen(false);
                      }}
                    >
                      <UserInfo>
                        <UserName>{user.name}</UserName>
                        <UserEmail>{user.email}</UserEmail>
                      </UserInfo>
                      <UserId>ID: {user.id}</UserId>
                    </DropdownItem>
                  ))
                )}
              </UserDropdown>
            )}
          </SearchContainer>
        </FormGroup>
      </form>
    </Modal>
  );
};

export default TaskFormModal;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  outline: none;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  outline: none;
  resize: vertical;
  font-family: inherit;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  outline: none;
  background: white;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.375rem;
`;

// User search specific styles
const SearchContainer = styled.div`
  position: relative;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem 0.625rem 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s;
  outline: none;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

const SelectedUserTag = styled.div`
  position: absolute;
  right: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  padding: 0 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  color: #4338ca;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1e1b4b;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div`
  padding: 0.625rem 0.875rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
`;

const UserEmail = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const UserId = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
`;
