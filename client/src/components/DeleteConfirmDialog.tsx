import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  // AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

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
          {/* <AlertDialogTitle className="text-gray-900 font-bold text-lg">
            Delete User
          </AlertDialogTitle> */}
          <AlertDialogDescription className="text-gray-400 text-sm text-center">
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
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            {isLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
