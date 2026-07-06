import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import ModalActions from "./ModalActions";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  userName?: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isLoading = false,
  userName,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl max-w-md">
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-1">
          <Trash2 size={22} className="text-red-500" />
        </div>

        <AlertDialogHeader className="text-center items-center">
          <AlertDialogDescription className="text-gray-500 text-sm">
            Are you sure you want to delete{" "}
            {userName ? (
              <span className="font-semibold text-gray-700">{userName}</span>
            ) : (
              "this user"
            )}
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex gap-2 mt-2">
          <ModalActions
            onCancel={onClose}
            onConfirm={onConfirm}
            isLoading={isLoading}
            confirmLabel="Delete"
            destructive
          />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
