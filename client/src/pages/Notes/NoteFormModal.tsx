import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import styled from "styled-components";
import type { Note } from "@/types/global";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import RichTextEditor from "@/components/RichTextEditor";

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  userId: number;
}

interface FormDataProps {
  title: string | "";
  body: string | "";
}

const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  note,
  userId,
}) => {
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const isSubmitting =
    createNoteMutation.isPending || updateNoteMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    defaultValues: {
      title: "",
      body: "",
    },
  });

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        body: note.body || "",
      });
    } else {
      reset({
        title: "",
        body: "",
      });
    }
  }, [note, reset, userId]);

  const onSubmit = async (data: FormDataProps) => {
    if (note?.id) {
      await updateNoteMutation.mutateAsync({ id: note.id, payload: data });
    } else {
      await createNoteMutation.mutateAsync(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{note ? "Edit Note" : "Create New Note"}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormGroup>
              <Label>Title *</Label>
              <Input
                {...register("title")}
                placeholder="Enter note title..."
                disabled={isSubmitting}
              />
              {errors.title && <ErrorText>{errors.title.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Content</Label>
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Write your note content..."
                  />
                )}
              />
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : note
                  ? "Update Note"
                  : "Create Note"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default NoteFormModal;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f0f0f0;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
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

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.375rem;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background: #6366f1;
    color: white;
    
    &:hover:not(:disabled) {
      background: #4f46e5;
    }
  `
      : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover:not(:disabled) {
      background: #e5e7eb;
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
