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
            col="fullName"
            label="Student"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="grade"
            label="Grade"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>
          <SortableHeader
            col="section"
            label="Section"
            sortBy={sortBy}
            order={order}
            onSort={onSort}
          />
        </TableHead>
        <TableHead className={HEAD_CLASS}>Guardian</TableHead>
        <TableHead className={HEAD_CLASS}>Status</TableHead>
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
