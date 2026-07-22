import styled from "styled-components";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface SortableHeaderProps {
  col: string;
  label: string;
  sortBy?: string;
  order?: SortOrder;
  onSort: (col: string) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({
  col,
  label,
  sortBy,
  order,
  onSort,
}) => {
  const Icon =
    sortBy !== col ? ArrowUpDown : order === "asc" ? ArrowUp : ArrowDown;

  return (
    <SortBtn onClick={() => onSort(col)}>
      {label} <Icon size={12} />
    </SortBtn>
  );
};

export default SortableHeader;

const SortBtn = styled.button.attrs({
  className:
    "flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors",
})``;
