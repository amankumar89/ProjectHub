import styled from "styled-components";
import { type LucideIcon } from "lucide-react";

interface ListEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  isError?: boolean;
}

const Wrap = styled.div.attrs({
  className:
    "flex flex-col items-center justify-center py-16 text-center gap-3",
})``;

const ListEmptyState: React.FC<ListEmptyStateProps> = ({
  icon: Icon,
  title,
  subtitle,
  isError = false,
}) => {
  if (isError) {
    return (
      <Wrap>
        <p className="text-sm text-red-400 font-medium">{title}</p>
      </Wrap>
    );
  }

  return (
    <Wrap>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
          <Icon size={24} className="text-gray-400" />
        </div>
      )}
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </Wrap>
  );
};

export default ListEmptyState;
