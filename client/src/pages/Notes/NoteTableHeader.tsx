import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SortableHeader from "@/components/SortableHeader";
import type { NoteSortByProps, SortOrder } from "@/types/global";

interface NoteTableHeaderProps {
  sortBy?: string;
  order?: SortOrder;
  onSort: (col: string) => void;
}

const HEAD_CLASS =
  "text-xs font-semibold text-gray-500 uppercase tracking-wide";

const NoteTableHeader: React.FC<NoteTableHeaderProps> = ({
  sortBy,
  order,
  onSort,
}) => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50 hover:bg-gray-50">
        <TableHead className={`${HEAD_CLASS} w-16`}>
          <SortableHeader
            col="id"
            label="ID"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="title"
            label="Title"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <span>Content</span>
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="createdAt"
            label="Created"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="updatedAt"
            label="Updated"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={`${HEAD_CLASS} text-right`}>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default NoteTableHeader;
