import { Loader2 } from "lucide-react";

interface ListLoadingStateProps {
  label?: string;
}

const ListLoadingState: React.FC<ListLoadingStateProps> = ({
  label = "Loading...",
}) => (
  <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
    <Loader2 size={20} className="animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);

export default ListLoadingState;
