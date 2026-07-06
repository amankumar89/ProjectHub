import { Badge } from "@/components/ui/badge";
import { STATUS_STYLE, STATUS_DOT } from "@/utils/helper";

interface StatusBadgeProps {
  value: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ value }) => (
  <Badge
    variant="outline"
    className={`flex items-center gap-1.5 w-fit text-xs font-semibold px-2 py-0.5 ${STATUS_STYLE[value]}`}
  >
    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[value]}`} />
    {value}
  </Badge>
);

export default StatusBadge;
