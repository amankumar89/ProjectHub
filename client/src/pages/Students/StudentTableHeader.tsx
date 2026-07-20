import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SortableHeader from "@/components/SortableHeader";

interface StudentsTableHeaderProps {
  sortBy?: string;
  order?: SortOrder;
  onSort: (col: string) => void;
}

const HEAD_CLASS =
  "text-xs font-semibold text-gray-500 uppercase tracking-wide";

const StudentsTableHeader: React.FC<StudentsTableHeaderProps> = ({
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
            label="Student"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="email"
            label="Email"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="phone"
            label="Phone"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="isActive"
            label="Status"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="enrolledAt"
            label="Enrolled"
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

export default StudentsTableHeader;
