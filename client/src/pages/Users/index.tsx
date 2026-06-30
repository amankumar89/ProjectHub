import { useState, useCallback } from "react";
import styled from "styled-components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { useGetUsers, useDeleteUser } from "@/hooks/useUsers";

import UserFormModal from "./UserFormModal";
import DeleteConfirmDialog from "@/pages/Users/DeleteConfirmDialog";

import {
  ROLE_STYLE,
  STATUS_STYLE,
  STATUS_DOT,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
  getInitials,
  formatDate,
} from "@/utils/helper";
import BackButton from "@/components/BackButton";

const AVATAR_BG: Record<Role, string> = {
  ADMIN: "bg-violet-100 text-violet-700",
  TEACHER: "bg-sky-100 text-sky-700",
  STUDENT: "bg-emerald-100 text-emerald-700",
  USER: "bg-gray-100 text-gray-600",
};

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
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / filters.limit);

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

  const SortIcon = ({ col }: { col: string }) => {
    if (filters.sortBy !== col) return <ArrowUpDown size={12} />;
    return filters.order === "asc" ? (
      <ArrowUp size={12} />
    ) : (
      <ArrowDown size={12} />
    );
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
            <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : isError ? (
            <EmptyState>
              <p className="text-sm text-red-400 font-medium">
                Failed to load users. Please try again.
              </p>
            </EmptyState>
          ) : users.length === 0 ? (
            <EmptyState>
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Users size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No users found
              </p>
              <p className="text-xs text-gray-400">
                Try adjusting your filters or create a new user.
              </p>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">
                    #
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <SortBtn onClick={() => handleSort("name")}>
                      User <SortIcon col="name" />
                    </SortBtn>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Role
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <SortBtn onClick={() => handleSort("lastLogin")}>
                      Last Login <SortIcon col="lastLogin" />
                    </SortBtn>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <SortBtn onClick={() => handleSort("createdAt")}>
                      Joined <SortIcon col="createdAt" />
                    </SortBtn>
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user, idx) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Index */}
                    <TableCell className="text-xs text-gray-400 font-mono">
                      {(filters.page - 1) * filters.limit + idx + 1}
                    </TableCell>

                    {/* User */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            AVATAR_BG[user.role]
                          }`}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 leading-tight">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold px-2 py-0.5 ${ROLE_STYLE[user.role]}`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1.5 w-fit text-xs font-semibold px-2 py-0.5 ${STATUS_STYLE[user.status]}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[user.status]}`}
                        />
                        {user.status}
                      </Badge>
                    </TableCell>

                    {/* Last Login */}
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(user.lastLogin)}
                    </TableCell>

                    {/* Joined */}
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <ActionBtn
                          onClick={() => handleEdit(user)}
                          className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Edit user"
                        >
                          <Pencil size={15} />
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => handleDeleteClick(user)}
                          className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete user"
                        >
                          <Trash2 size={15} />
                        </ActionBtn>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableWrap>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <Pagination>
            <PageInfo>
              Showing{" "}
              <span className="font-medium text-gray-700">
                {(filters.page - 1) * filters.limit + 1}–
                {Math.min(filters.page * filters.limit, total)}
              </span>{" "}
              of <span className="font-medium text-gray-700">{total}</span>
            </PageInfo>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-lg border-gray-200"
                disabled={filters.page === 1}
                onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
              >
                <ChevronLeft size={15} />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - filters.page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`dots-${i}`}
                      className="text-gray-300 px-1 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={filters.page === p ? "default" : "outline"}
                      size="icon"
                      className={`w-8 h-8 rounded-lg text-sm ${
                        filters.page === p
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                          : "border-gray-200 text-gray-600"
                      }`}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, page: p as number }))
                      }
                    >
                      {p}
                    </Button>
                  ),
                )}

              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-lg border-gray-200"
                disabled={filters.page === totalPages || totalPages === 0}
                onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
              >
                <ChevronRight size={15} />
              </Button>
            </div>
          </Pagination>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <UserFormModal
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

const EmptyState = styled.div.attrs({
  className:
    "flex flex-col items-center justify-center py-16 text-center gap-3",
})``;

const Pagination = styled.div.attrs({
  className:
    "flex items-center justify-between px-4 py-3 border-t border-gray-100",
})``;

const PageInfo = styled.p.attrs({
  className: "text-sm text-gray-400",
})``;

const SortBtn = styled.button.attrs({
  className:
    "flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors",
})``;

const ActionBtn = styled.button.attrs({
  className: "p-1.5 rounded-lg transition-colors duration-150",
})``;
