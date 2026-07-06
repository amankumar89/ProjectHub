import { getInitials } from "@/utils/helper";

const AVATAR_BG: Record<Role, string> = {
  ADMIN: "bg-violet-100 text-violet-700",
  TEACHER: "bg-sky-100 text-sky-700",
  STUDENT: "bg-emerald-100 text-emerald-700",
  USER: "bg-gray-100 text-gray-600",
};

interface AvatarProps {
  name: string;
  role: Role;
  size?: "sm" | "md";
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
};

const Avatar: React.FC<AvatarProps> = ({ name, role, size = "md" }) => {
  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold shrink-0 ${SIZE_CLASSES[size]} ${AVATAR_BG[role]}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
