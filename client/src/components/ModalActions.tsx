import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ModalActionsProps {
  onCancel: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
  confirmLabel: string;
  confirmType?: "button" | "submit";
  destructive?: boolean;
}

const ModalActions: React.FC<ModalActionsProps> = ({
  onCancel,
  onConfirm,
  isLoading = false,
  confirmLabel,
  confirmType = "button",
  destructive = false,
}) => {
  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        type={confirmType}
        onClick={onConfirm}
        disabled={isLoading}
        className={`rounded-xl text-white min-w-24 ${
          destructive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {isLoading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          confirmLabel
        )}
      </Button>
    </>
  );
};

export default ModalActions;
