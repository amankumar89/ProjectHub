import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import styled from "styled-components";
import { formatDate } from "@/utils/helper";
import type { Note, Paginated } from "@/types/global";
import { useNotes } from "@/hooks/useNotes";

interface NotesTableProps {
  data: Paginated<Note, "notes"> | undefined;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

const NotesTable: React.FC<NotesTableProps> = ({ data, onEdit, onDelete }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-xs text-gray-400 font-mono">
          #{row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {row.original.title}
          </p>
          {/* {row.original.body && (
            <p className="text-xs text-gray-400 truncate max-w-xs">
              {row.original.body.replace(/<[^>]*>/g, "").substring(0, 100)}
            </p>
          )} */}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatDate(row.original.createdAt.toString())}
        </div>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatDate(row.original.updatedAt.toString())}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {/* <ActionBtn
            onClick={() => onView(row.original)}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            title="View note"
          >
            <Eye size={15} />
          </ActionBtn> */}
          <ActionBtn
            onClick={() => onEdit(row.original)}
            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            title="Edit note"
          >
            <Pencil size={15} />
          </ActionBtn>
          <ActionBtn
            onClick={() => onDelete(row.original)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete note"
          >
            <Trash2 size={15} />
          </ActionBtn>
        </div>
      ),
    },
  ];

  const notes = data?.notes;

  const table = useReactTable({
    data: notes!,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalRows = data?.pagination?.total;
  const pageCount = data?.pagination?.totalPages;
  const currentPage = data?.pagination?.page;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const total = pageCount ?? 0;
    const current = currentPage ?? 1;
    const delta = 2;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i);
      } else if (pages[pages?.length - 1] !== -1) {
        pages.push(-1); // -1 represents ellipsis
      }
    }
    return pages;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-gray-50 hover:bg-gray-50"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {data!.notes!.length! > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50/70 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns?.length}
                className="text-center py-8 text-gray-500"
              >
                No notes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* Pagination */}
      <PaginationWrapper>
        <PaginationInfo>
          Showing{" "}
          {totalRows > 0
            ? table.getState().pagination.pageIndex * pageSize + 1
            : 0}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * pageSize,
            totalRows,
          )}{" "}
          of {totalRows} results
        </PaginationInfo>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rows:</span>
            <PageSizeSelect
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPageIndex(0);
              }}
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </PageSizeSelect>
          </div>

          <PaginationControls>
            <PageButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Previous page"
            >
              <ChevronLeft size={16} />
            </PageButton>

            {getPageNumbers().map((pageNum, index) => (
              <PageButton
                key={index}
                $active={pageNum === currentPage}
                onClick={() =>
                  pageNum !== -1 && table.setPageIndex(pageNum - 1)
                }
                disabled={pageNum === -1}
              >
                {pageNum === -1 ? "…" : pageNum}
              </PageButton>
            ))}

            <PageButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Next page"
            >
              <ChevronRight size={16} />
            </PageButton>
          </PaginationControls>
        </div>
      </PaginationWrapper>
    </div>
  );
};

export default NotesTable;

const ActionBtn = styled.button.attrs({
  className: "p-1.5 rounded-lg transition-colors duration-150",
})``;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.75rem;
  border: 1px solid ${(props) => (props.$active ? "#6366f1" : "#d1d5db")};
  border-radius: 6px;
  background: ${(props) => (props.$active ? "#6366f1" : "white")};
  color: ${(props) => (props.$active ? "white" : "#374151")};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 36px;
  text-align: center;

  &:hover:not(:disabled) {
    border-color: #6366f1;
    background: ${(props) => (props.$active ? "#4f46e5" : "#f3f4f6")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageSizeSelect = styled.select`
  padding: 0.375rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  color: #374151;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;
