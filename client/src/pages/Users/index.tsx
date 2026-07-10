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
import { Plus, Search, Users } from "lucide-react";
import { useGetUsers, useDeleteUser } from "@/hooks/useUsers";
import FormModal from "./FormModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { ROLE_OPTIONS, STATUS_OPTIONS } from "@/utils/helper";
import BackButton from "@/components/BackButton";
import ListLoadingState from "@/components/ListLoadingState";
import ListEmptyState from "@/components/ListEmptyState";
import UsersTableHeader from "./UserTableHeader";
import UserTableRow from "./UserTableRow";
import TablePagination from "@/components/TablePagination";

const DEFAULT_FILTERS: UserFilters = {
  page: 1,
  limit: 10,
  role: "",
  status: "",
  sortBy: "createdAt",
  order: "desc",
  search: "",
};

const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null); // null = create
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const { data, isLoading, isError } = useGetUsers(filters);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users: User[] = data?.users ?? [];
  const total: number = data?.pagination.total ?? 0;

  const updateFilter = useCallback(
    <K extends keyof UserFilters>(key: K, value: UserFilters[K] | "") => {
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

  const handleEdit = (user: User) => {
    if (!user) return;
    setSelectedId(user.id!);
    setFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id!, {
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
          <PageTitle>Users</PageTitle>
          <PageSub>
            {total > 0 ? `${total} users found` : "Manage all users"}
          </PageSub>
        </TitleBlock>

        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm shadow-indigo-200"
        >
          <Plus size={16} />
          Create User
        </Button>
      </Header>

      <Card>
        <FilterBar>
          <SearchWrap>
            <SearchIcon>
              <Search size={15} />
            </SearchIcon>
            <Input
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="pl-9 rounded-xl border-gray-200 text-sm focus:border-indigo-400 focus:ring-indigo-100"
            />
          </SearchWrap>

          <FilterGroup>
            <Select
              value={filters.role ?? ""}
              onValueChange={(val) => updateFilter("role", val as Role)}
            >
              <SelectTrigger className="w-36 rounded-xl border-gray-200 text-sm">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {[{ label: "All Roles", value: "" }, ...ROLE_OPTIONS].map(
                  (o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status ?? ""}
              onValueChange={(val) => updateFilter("status", val as Status)}
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

            {/* Limit */}
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

        {/* Table */}
        <TableWrap>
          {isLoading ? (
            <ListLoadingState />
          ) : isError ? (
            <ListEmptyState
              title="Failed to load users. Please try again."
              isError
            />
          ) : users.length === 0 ? (
            <ListEmptyState
              title="No users found"
              subtitle="Try adjusting your filters or create a new user."
              icon={Users}
            />
          ) : (
            <Table>
              <UsersTableHeader
                sortBy={filters.sortBy}
                order={filters.order}
                onSort={handleSort}
              />
              <TableBody>
                {users.map((user, idx) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={(filters.page - 1) * filters.limit + idx + 1}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </TableWrap>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <TablePagination
            page={filters.page}
            limit={filters.limit}
            total={total}
            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          />
        )}
      </Card>

      {/* Create / Edit Modal */}
      <FormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedId(null);
        }}
        id={selectedId}
      />

      {/* Delete Confirm */}
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

export default UsersPage;

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
