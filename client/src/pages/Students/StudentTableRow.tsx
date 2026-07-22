import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import styled from "styled-components";
import StudentAvatar from "./StudentAvatar";
import StatusBadge from "@/components/StatusBadge";
import { formatDate } from "@/utils/helper";

const ActionBtn = styled.button.attrs({
  className: "p-1.5 rounded-lg transition-colors duration-150",
})``;

interface StudentTableRowProps {
  student: Student;
  index: number;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

const StudentTableRow: React.FC<StudentTableRowProps> = ({
  student,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow className="hover:bg-gray-50/70 transition-colors">
      <TableCell className="text-xs text-gray-400 font-mono">{index}</TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <StudentAvatar name={student.name} />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {student.name}
            </p>
            <p className="text-xs text-gray-400">
              Student ID: {student.studentId}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-sm text-gray-600">{student.email}</TableCell>

      <TableCell className="text-sm text-gray-600">{student.phone}</TableCell>

      <TableCell>
        <StatusBadge value={student.isActive ? "ACTIVE" : "INACTIVE"} />
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(student.enrolledAt)}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn
            onClick={() => onEdit(student)}
            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            title="Edit student"
          >
            <Pencil size={15} />
          </ActionBtn>
          <ActionBtn
            onClick={() => onDelete(student)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete student"
          >
            <Trash2 size={15} />
          </ActionBtn>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StudentTableRow;
