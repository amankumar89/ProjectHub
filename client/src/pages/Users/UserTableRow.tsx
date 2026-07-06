import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import styled from "styled-components";
import Avatar from "@/components/Avatar";
import { formatDate } from "@/utils/helper";
import { RoleBadge } from "@/components/RoleBadge";
import StatusBadge from "@/components/StatusBadge";

const ActionBtn = styled.button.attrs({
  className: "p-1.5 rounded-lg transition-colors duration-150",
})``;

interface UserTableRowProps {
  user: User;
  index: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow className="hover:bg-gray-50/70 transition-colors">
      <TableCell className="text-xs text-gray-400 font-mono">{index}</TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} role={user.role} />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <RoleBadge value={user.role} />
      </TableCell>

      <TableCell>
        <StatusBadge value={user.status} />
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(user.lastLogin)}
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(user.createdAt)}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn
            onClick={() => onEdit(user)}
            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            title="Edit user"
          >
            <Pencil size={15} />
          </ActionBtn>
          <ActionBtn
            onClick={() => onDelete(user)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete user"
          >
            <Trash2 size={15} />
          </ActionBtn>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
