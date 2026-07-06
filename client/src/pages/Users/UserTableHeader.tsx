import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SortableHeader from "@/components/SortableHeader";

interface UsersTableHeaderProps {
  sortBy?: string;
  order?: SortOrder;
  onSort: (col: string) => void;
}

const HEAD_CLASS =
  "text-xs font-semibold text-gray-500 uppercase tracking-wide";

const UsersTableHeader: React.FC<UsersTableHeaderProps> = ({
  sortBy,
  order,
  onSort,
}) => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50 hover:bg-gray-50">
        <TableHead className={`${HEAD_CLASS} w-12`}>#</TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="name"
            label="User"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>Role</TableHead>
        <TableHead className={HEAD_CLASS}>Status</TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="lastLogin"
            label="Last Login"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="createdAt"
            label="Joined"
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

export default UsersTableHeader;
