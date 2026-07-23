import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, FileText } from "lucide-react";
import styled from "styled-components";
import { formatDate } from "@/utils/helper";

interface NoteTableRowProps {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

const NoteTableRow: React.FC<NoteTableRowProps> = ({
  note,
  index,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow className="hover:bg-gray-50/70 transition-colors">
      <TableCell className="text-xs text-gray-400 font-mono">{index}</TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <NoteIcon>
            <FileText size={16} />
          </NoteIcon>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {note.title}
            </p>
            <p className="text-xs text-gray-400">ID: {note.id}</p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <TruncatedContent>{note.body || "No content"}</TruncatedContent>
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(String(note.createdAt))}
      </TableCell>

      <TableCell className="text-sm text-gray-500">
        {formatDate(String(note.updatedAt))}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <ActionBtn
            onClick={() => onEdit(note)}
            className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            title="Edit note"
          >
            <Pencil size={15} />
          </ActionBtn>
          <ActionBtn
            onClick={() => onDelete(note)}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Delete note"
          >
            <Trash2 size={15} />
          </ActionBtn>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default NoteTableRow;

const ActionBtn = styled.button.attrs({
  className: "p-1.5 rounded-lg transition-colors duration-150",
})``;

const NoteIcon = styled.div.attrs({
  className:
    "flex items-center justify-center w-9 h-9 rounded-lg bg-linear-to-br from-blue-100 to-purple-100 text-blue-600",
})``;

const TruncatedContent = styled.p.attrs({
  className: "text-sm text-gray-500 line-clamp-2 max-w-xs",
})``;
