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
import { Plus, Search, GraduationCap } from "lucide-react";

import { useStudents, useDeleteStudent } from "@/hooks/useStudents";
import {
  GRADE_OPTIONS,
  removeEmptyFields,
  SECTION_OPTIONS,
} from "@/utils/helper";
import { STATUS_OPTIONS } from "@/utils/helper";

import StudentFormModal from "./FormModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import StudentsTableHeader from "./StudentTableHeader";
import StudentTableRow from "./StudentTableRow";
import ListLoadingState from "@/components/ListLoadingState";
import ListEmptyState from "@/components/ListEmptyState";
import TablePagination from "@/components/TablePagination";
import BackButton from "@/components/BackButton";
import type { Student, StudentFilters } from "@/types/global";

const DEFAULT_FILTERS: StudentFilters = {
  page: 1,
  limit: 10,
  grade: "",
  section: "",
  isActive: true,
  sortBy: "enrolledAt",
  order: "desc",
  search: "",
};

const Students: React.FC = () => {
  const [filters, setFilters] = useState<StudentFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);

  const { data, isLoading, isError } = useStudents(removeEmptyFields(filters));
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent();

  const students: Student[] = data?.students ?? [];
  const total: number = data?.pagination.total ?? 0;

  const updateFilter = useCallback(
    <K extends keyof StudentFilters>(
      key: K,
      value: StudentFilters[K] | null,
    ) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [],
  );

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateFilter("search", searchInput.trim());
    }
  };

  const handleSort = (col: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: col,
      order: prev.sortBy === col && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleCreate = () => {
    setSelectedId(null);
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedId(student.id);
    setFormOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setDeleteTarget(student);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteStudent(deleteTarget.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeleteTarget(null);
      },
      onError: () => {},
    });
  };

  return (
    <Wrapper>
      <Header>
        <TitleBlock>
          <PageTitle>Students</PageTitle>
          <PageSub>
            {total > 0 ? `${total} students found` : "Manage all students"}
          </PageSub>
        </TitleBlock>

        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-200"
        >
          <Plus size={16} />
          Create Student
        </Button>
      </Header>

      <Card>
        <FilterBar>
          <SearchWrap>
            <SearchIcon>
              <Search size={15} />
            </SearchIcon>
            <Input
              placeholder="Search by name or roll number..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="pl-9 rounded-xl border-gray-200 text-sm focus:border-indigo-400 focus:ring-indigo-100"
            />
          </SearchWrap>

          <FilterGroup>
            <Select
              value={filters.grade ?? ""}
              onValueChange={(val) => updateFilter("grade", val)}
            >
              <SelectTrigger className="w-32 rounded-xl border-gray-200 text-sm">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {[{ label: "All Grades", value: "" }, ...GRADE_OPTIONS].map(
                  (o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            <Select
              value={filters.section ?? ""}
              onValueChange={(val) => updateFilter("section", val)}
            >
              <SelectTrigger className="w-32 rounded-xl border-gray-200 text-sm">
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {[{ label: "All Sections", value: "" }, ...SECTION_OPTIONS].map(
                  (o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            <Select
              value={filters.isActive ? "ACTIVE" : "INACTIVE"}
              onValueChange={(val: string | null) =>
                updateFilter("isActive", val === "ACTIVE")
              }
            >
              <SelectTrigger className="w-36 rounded-xl border-gray-200 text-sm">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
            <ListLoadingState label="Loading students..." />
          ) : isError ? (
            <ListEmptyState
              isError
              title="Failed to load students. Please try again."
            />
          ) : students.length === 0 ? (
            <ListEmptyState
              icon={GraduationCap}
              title="No students found"
              subtitle="Try adjusting your filters or enroll a new student."
            />
          ) : (
            <Table>
              <StudentsTableHeader
                sortBy={filters.sortBy}
                order={filters.order}
                onSort={handleSort}
              />
              <TableBody>
                {students.map((student, idx) => (
                  <StudentTableRow
                    key={student.id}
                    student={student}
                    index={(filters.page! - 1) * filters.limit! + idx + 1}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </TableWrap>

        {!isLoading && students.length > 0 && (
          <TablePagination
            page={filters.page!}
            limit={filters.limit!}
            total={total}
            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          />
        )}
      </Card>

      <StudentFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedId(null);
        }}
        id={selectedId}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        userName={deleteTarget?.name}
      />
      <BackButton />
    </Wrapper>
  );
};

export default Students;

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
