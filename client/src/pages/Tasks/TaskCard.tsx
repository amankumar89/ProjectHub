import { Pencil, Trash2, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const STATUS_STYLES: Record<string, string> = {
  TODO: "bg-slate-100 text-slate-700 border-slate-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  DONE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BLOCKED: "bg-red-50 text-red-700 border-red-200",
};

const PRIORITY_STYLES: Record<string, string> = {
  LOW: "bg-slate-50 text-slate-500 border-slate-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-orange-50 text-orange-700 border-orange-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
};

function formatDate(value: Date | string | null) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const dueDateLabel = formatDate(task.dueDate);

  return (
    <Card className="my-2 flex flex-col gap-2 bg-white p-2 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          {task.title && (
            <h3 className="truncate text-sm font-semibold text-slate-900">
              {task.title}
            </h3>
          )}
          {task.status && (
            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-2 py-0 text-[11px] font-medium",
                STATUS_STYLES[task.status],
              )}
            >
              {task.status.replace("_", " ")}
            </Badge>
          )}
          {task.priority && (
            <Badge
              variant="outline"
              className={cn(
                "rounded-full px-2 py-0 text-[11px] font-medium",
                PRIORITY_STYLES[task.priority],
              )}
            >
              {task.priority}
            </Badge>
          )}
        </div>

        {task.description && (
          <p className="line-clamp-2 text-sm text-slate-500">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
          {dueDateLabel && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Due {dueDateLabel}
            </span>
          )}
          {task!.assignedTo!.name && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {task.assignedTo!.name}
            </span>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex flex-col shrink-0 items-center gap-2 self-end sm:self-center">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-slate-600"
          onClick={() => onEdit?.(task)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete?.(task)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
