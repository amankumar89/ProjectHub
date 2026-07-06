import { Badge } from "@/components/ui/badge";
import { ROLE_STYLE } from "@/utils/helper";

interface RoleBadgeProps {
  value: Role;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ value }) => (
  <Badge
    variant="outline"
    className={`text-xs font-semibold px-2 py-0.5 ${ROLE_STYLE[value]}`}
  >
    {value}
  </Badge>
);
