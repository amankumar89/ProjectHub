import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import styled from "styled-components";
import NotesTable from "./NotesTable";
import NoteFormModal from "./NoteFormModal";
import type { Note, NotesQueryParams } from "@/types/global";
import { useDeleteNote, useNotes } from "@/hooks/useNotes";
import { useSearchParams } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";

const NotesPage: React.FC = () => {
  const deleteNoteMutation = useDeleteNote();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get("search") ?? "";
  });
  const queryParams: NotesQueryParams = {
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
    // sortBy: (searchParams.get("sortBy") as NotesQueryParams["sortBy"]) || "id",
    // sortOrder:
    //   (searchParams.get("sortOrder") as NotesQueryParams["sortOrder"]) ||
    //   "desc",
    search: searchParams.get("search") || undefined,
  };

  const { data, isLoading, refetch } = useNotes({
    ...queryParams,
    search: searchTerm || undefined,
  });

  // Update URL when filters change
  const updateQueryParams = (updates: Partial<NotesQueryParams>) => {
    const newParams = { ...queryParams, ...updates };

    // Remove undefined values
    Object.keys(newParams).forEach((key) => {
      if (newParams[key as keyof NotesQueryParams] === undefined) {
        delete newParams[key as keyof NotesQueryParams];
      }
    });

    setSearchParams(newParams as Record<string, string>);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  // Handle page size change
  const handleLimitChange = (limit: number) => {
    updateQueryParams({ limit, page: 1 });
  };

  // Handle sort change
  // const handleSortChange = (sortBy: string, sortOrder?: "asc" | "desc") => {
  //   updateQueryParams({ sortBy, sortOrder });
  // };

  // Handle search input change
  const handleSearchChange = useDebounce((value: string) => {
    setSearchTerm(value);
  });

  const userId = 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        updateQueryParams({ search: searchTerm, page: 1 });
      } else {
        updateQueryParams({ search: undefined, page: 1 });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchTerm, updateQueryParams]);

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setIsFormOpen(true);
  };

  const handleDelete = async (note: Note) => {
    await deleteNoteMutation.mutateAsync(note.id);
  };

  const handleCreateNew = () => {
    setSelectedNote(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedNote(null);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>My Notes</PageTitle>
        <HeaderActions>
          <SearchWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </SearchWrapper>
          <CreateButton onClick={handleCreateNew}>
            <Plus size={18} />
            New Note
          </CreateButton>
        </HeaderActions>
      </PageHeader>

      {isLoading ? (
        <LoadingState>Loading notes...</LoadingState>
      ) : (
        <NotesTable data={data} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <NoteFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        note={selectedNote}
        userId={userId}
      />
    </PageContainer>
  );
};

export default NotesPage;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 0.875rem;
  min-width: 250px;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 0.875rem;
  color: #9ca3af;
  width: 18px;
  height: 18px;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4f46e5;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;
