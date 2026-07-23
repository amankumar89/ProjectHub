import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import styled from "styled-components";
import { formatDate } from "@/utils/helper";

interface TaskTableRowProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskTableRow: React.FC<TaskTableRowProps> = ({
  task,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow className="hover:bg-gray-50/70 transition-colors">
      <TableCell className="text-xs text-gray-400 font-mono">{index}</TableCell>

      <TableCell>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">
            {task.title}
          </p>
          <p className="text-xs text-gray-400">ID: {task.id}</p>
        </div>
      </TableCell>

      <TableCell>
        <TruncatedContent>{task.description || "--"}</TruncatedContent>
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(String(task.createdAt))}
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(String(task.updatedAt))}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            title="Edit task"
          >
            <Pencil size={15} />
          </ActionBtn>
          <ActionBtn
            onClick={() => onDelete(task)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete task"
          >
            <Trash2 size={15} />
          </ActionBtn>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TaskTableRow;

const ActionBtn = styled.button.attrs({
  className: "p-1.5 rounded-lg transition-colors duration-150",
})``;

const TruncatedContent = styled.p.attrs({
  className: "text-sm text-gray-500 line-clamp-2 max-w-xs",
})``;
