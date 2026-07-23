import { useState, useCallback } from "react";
import styled from "styled-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody } from "@/components/ui/table";
import { Plus, Search, StickyNote } from "lucide-react";

import { useNotes, useDeleteNote } from "@/hooks/useNotes";
import { removeEmptyFields } from "@/utils/helper";

import TaskFormModal from "./TaskFormModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import TaskTableHeader from "./TaskTableHeader";
import TaskTableRow from "./TaskTableRow";
import ListLoadingState from "@/components/ListLoadingState";
import ListEmptyState from "@/components/ListEmptyState";
import TablePagination from "@/components/TablePagination";

const DEFAULT_FILTERS: NotesQueryParams = {
  page: 1,
  limit: 10,
  sortBy: "updatedAt",
  sortOrder: "desc",
  search: "",
};

const TasksPage: React.FC = () => {
  const [filters, setFilters] = useState<NotesQueryParams>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState<string | null>("");

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);

  const { data, isLoading, isError } = useNotes(removeEmptyFields(filters));
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  const notes: Note[] = data?.notes ?? [];
  const total: number = data?.pagination?.total ?? 0;

  const updateFilter = useCallback(
    <K extends keyof NotesQueryParams>(
      key: K,
      value: NotesQueryParams[K] | null,
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [],
  );

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateFilter("search", searchInput);
    }
  };

  const handleSort = (col: string) => {
    setFilters((prev: NotesQueryParams) => ({
      ...prev,
      sortBy: col as NoteSortByProps,
      sortOrder:
        prev.sortBy === col && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleCreate = () => {
    setSelectedNote(null);
    setFormOpen(true);
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteNote(deleteTarget.id, {
      onSuccess: () => {
        // setDeleteOpen(false);
        setDeleteTarget(null);
      },
    });
  };

  return (
    <Wrapper>
      <Header>
        <TitleBlock>
          <PageTitle>Notes</PageTitle>
          <PageSub>
            {total > 0 ? `${total} notes found` : "Manage all your notes"}
          </PageSub>
        </TitleBlock>

        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-200"
        >
          <Plus size={16} />
          Create Note
        </Button>
      </Header>

      <Card>
        <FilterBar>
          <SearchWrap>
            <SearchIcon>
              <Search size={15} />
            </SearchIcon>
            <Input
              placeholder="Search by title or content..."
              value={searchInput!}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="pl-9 rounded-xl border-gray-200 text-sm focus:border-indigo-400 focus:ring-indigo-100"
            />
          </SearchWrap>

          <FilterGroup>
            <Select
              value={String(filters.limit)}
              onValueChange={(val) => updateFilter("limit", Number(val))}
            >
              <SelectTrigger className="w-24 rounded-xl border-gray-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {[10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterGroup>
        </FilterBar>

        <TableWrap>
          {isLoading ? (
            <ListLoadingState label="Loading notes..." />
          ) : isError ? (
            <ListEmptyState
              isError
              title="Failed to load notes. Please try again."
            />
          ) : notes.length === 0 ? (
            <ListEmptyState
              icon={StickyNote}
              title="No notes found"
              subtitle="Try adjusting your filters or create a new note."
            />
          ) : (
            <Table>
              <TaskTableHeader
                sortBy={filters.sortBy}
                order={filters.sortOrder}
                onSort={handleSort}
              />
              <TableBody>
                {notes.map((note, idx) => (
                  <TaskTableRow
                    key={note.id}
                    note={note}
                    index={(filters.page! - 1) * filters.limit! + idx + 1}
                    onEdit={handleEdit}
                    onDelete={(note: Note) => setDeleteTarget(note)}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </TableWrap>

        {!isLoading && notes.length > 0 && (
          <TablePagination
            page={filters.page!}
            limit={filters.limit!}
            total={total}
            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          />
        )}
      </Card>

      <TaskFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget?.id}
        onClose={() => {
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        userName={deleteTarget?.title}
      />
    </Wrapper>
  );
};

export default TasksPage;

const Wrapper = styled.div.attrs({
  className: "min-h-screen bg-[#F7F8FC]",
})``;

const Header = styled.div.attrs({
  className:
    "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8",
})``;

const TitleBlock = styled.div.attrs({ className: "flex flex-col" })``;

const PageTitle = styled.h1.attrs({
  className: "text-2xl font-bold text-gray-900 tracking-tight",
})``;

const PageSub = styled.p.attrs({
  className: "text-sm text-gray-400 mt-0.5",
})``;

const Card = styled.div.attrs({
  className:
    "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
})``;

const FilterBar = styled.div.attrs({
  className:
    "flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 border-b border-gray-100",
})``;

const SearchWrap = styled.div.attrs({
  className: "relative flex-1 min-w-0",
})``;

const SearchIcon = styled.span.attrs({
  className:
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none",
})``;

const FilterGroup = styled.div.attrs({
  className: "flex items-center gap-2 flex-wrap",
})``;

const TableWrap = styled.div.attrs({
  className: "overflow-x-auto",
})``;
