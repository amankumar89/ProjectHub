import React from "react";
import styled from "styled-components";
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  FlagIcon,
  CircleIcon,
  CheckCircleIcon,
  PencilIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/utils/helper";

const statusConfig = {
  TODO: { label: "TODO", icon: CircleIcon, color: "#3b82f6" },
  IN_PROGRESS: { label: "IN PROGRESS", icon: PencilIcon, color: "#f59e0b" },
  DONE: { label: "DONE", icon: CheckCircleIcon, color: "#10b981" },
  BACKLOG: { label: "BACKLOG", icon: CircleIcon, color: "#6b7280" },
} as const;

interface TaskCardProps {
  task: Task;
  className?: string;
  onClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  className = "",
  onClick = () => {},
}) => {
  const {
    id,
    title,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    createdBy,
    createdAt,
    updatedAt,
  } = task;

  const statusInfo =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.TODO;
  const StatusIcon = statusInfo.icon;

  const formatTime = (iso: Date | string) => {
    try {
      return new Date(iso).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(iso).slice(11, 16);
    }
  };

  const priorityIcon =
    {
      LOW: "↓",
      MEDIUM: "−",
      HIGH: "↑",
      CRITICAL: "‼",
    }[priority] || "•";

  return (
    <Wrapper className={className} onClick={() => onClick(task)}>
      <StyledCard>
        <CardHeader className="pb-2">
          <CardHeaderWrapper>
            <TitleWrapper>
              <TaskId>#{id}</TaskId>
              <TaskTitle>{title}</TaskTitle>
            </TitleWrapper>
            <StatusBadge $statusColor={statusInfo.color}>
              <StatusIcon
                className="w-3 h-3"
                style={{ color: statusInfo.color }}
              />
              {statusInfo.label}
            </StatusBadge>
          </CardHeaderWrapper>
        </CardHeader>

        <CardContent className="pt-2">
          <DescriptionWrapper>
            <span className="text-gray-500 mr-2">📝</span>
            {description}
          </DescriptionWrapper>

          <MetaGrid>
            <MetaItem>
              <FlagIcon className="w-4 h-4 text-gray-400" />
              <MetaLabel>Priority</MetaLabel>
              <MetaValue $priority={priority}>
                {priorityIcon} {priority}
              </MetaValue>
            </MetaItem>

            <MetaItem>
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <MetaLabel>Due</MetaLabel>
              <MetaValue className="bg-blue-50 text-blue-700">
                {formatDate(dueDate)}
              </MetaValue>
            </MetaItem>

            <MetaItem>
              <UserIcon className="w-4 h-4 text-gray-400" />
              <MetaLabel>Assigned</MetaLabel>
              <MetaValue className="bg-purple-50 text-purple-700">
                User #{assignedTo}
              </MetaValue>
            </MetaItem>

            <MetaItem>
              <UserIcon className="w-4 h-4 text-gray-400" />
              <MetaLabel>Creator</MetaLabel>
              <MetaValue className="bg-indigo-50 text-indigo-700">
                User #{createdBy}
              </MetaValue>
            </MetaItem>
          </MetaGrid>
        </CardContent>

        <CardFooter className="flex-col items-stretch pt-0">
          <FooterWrapper>
            <FooterLeft>
              <Timestamp>
                <CalendarIcon className="w-3 h-3" />
                {formatDate(createdAt)}
              </Timestamp>
              <Timestamp>
                <ClockIcon className="w-3 h-3" />
                {formatTime(createdAt)}
              </Timestamp>
              <AssignedBadge>
                <UserIcon className="w-3 h-3" />
                created
              </AssignedBadge>
            </FooterLeft>
            <FooterRight>
              <Timestamp className="bg-gray-50">
                <PencilIcon className="w-3 h-3" />
                {formatDate(updatedAt)}
              </Timestamp>
              <Timestamp className="bg-gray-50">
                <ClockIcon className="w-3 h-3" />
                {formatTime(updatedAt)}
              </Timestamp>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                updated
              </span>
            </FooterRight>
          </FooterWrapper>

          <ISOTimestamps>
            <span>📅 created: {formatDate(createdAt)}</span>
            <span>✏️ updated: {formatDate(updatedAt)}</span>
          </ISOTimestamps>
        </CardFooter>
      </StyledCard>
    </Wrapper>
  );
};

export default TaskCard;

const Wrapper = styled.div.attrs({
  className: "w-full max-w-md mx-auto p-4",
})``;

const StyledCard = styled(Card).attrs({
  className:
    "w-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-100",
})``;

const CardHeaderWrapper = styled.div.attrs({
  className: "flex items-start justify-between gap-4",
})``;

const TitleWrapper = styled.div.attrs({
  className: "flex items-center gap-2 flex-1 min-w-0",
})``;

const TaskTitle = styled(CardTitle).attrs({
  className: "text-xl font-semibold text-gray-900 truncate",
})``;

const TaskId = styled.span.attrs({
  className:
    "text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0",
})``;

const StatusBadge = styled(Badge).attrs<{ $statusColor: string }>((props) => ({
  className: `capitalize font-medium px-3 py-1 gap-1.5 ${props.className || ""}`,
  variant: "outline",
}))<{ $statusColor: string }>`
  border-color: ${(props) => props.$statusColor}40;
  color: ${(props) => props.$statusColor};
  background: ${(props) => props.$statusColor}15;
`;

const DescriptionWrapper = styled.div.attrs({
  className:
    "bg-gray-50 rounded-lg p-3 text-sm text-gray-700 border border-gray-100",
})``;

const MetaGrid = styled.div.attrs({
  className:
    "grid grid-cols-2 gap-2 bg-gray-50/80 rounded-lg p-3 my-3 border border-gray-100",
})``;

const MetaItem = styled.div.attrs({
  className: "flex items-center gap-2 text-sm",
})``;

const MetaLabel = styled.span.attrs({
  className: "text-gray-500 font-medium",
})``;

const MetaValue = styled.span<{ $priority?: string }>`
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.75rem;
  background: white;

  ${(props) => {
    if (props.$priority === "HIGH" || props.$priority === "CRITICAL") {
      return "background: #fef2f2; color: #dc2626;";
    }
    if (props.$priority === "MEDIUM") {
      return "background: #fffbeb; color: #d97706;";
    }
    return "background: #ecfdf5; color: #059669;";
  }}
`;

const FooterWrapper = styled.div.attrs({
  className:
    "flex flex-wrap items-center justify-between gap-2 pt-3 mt-1 border-t border-gray-100",
})``;

const FooterLeft = styled.div.attrs({
  className: "flex items-center gap-2 flex-wrap",
})``;

const FooterRight = styled.div.attrs({
  className: "flex items-center gap-2 flex-wrap",
})``;

const Timestamp = styled.span.attrs({
  className:
    "text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1",
})``;

const AssignedBadge = styled.span.attrs({
  className:
    "text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium",
})``;

const ISOTimestamps = styled.div.attrs({
  className:
    "mt-2 pt-2 border-t border-dashed border-gray-200 text-[10px] text-gray-400 flex flex-wrap justify-between gap-1",
})``;
