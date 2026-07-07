import { getInitials } from "@/utils/helper";

interface StudentAvatarProps {
  name: string;
  size?: "sm" | "md";
}

const SIZE_CLASSES: Record<NonNullable<StudentAvatarProps["size"]>, string> = {
  sm: "w-7 h-7 text-[10px]",
  md: "w-9 h-9 text-xs",
};

const StudentAvatar: React.FC<StudentAvatarProps> = ({ name, size = "md" }) => (
  <div
    className={`rounded-xl flex items-center justify-center font-bold shrink-0 bg-amber-100 text-amber-700 ${SIZE_CLASSES[size]}`}
  >
    {getInitials(name)}
  </div>
);

export default StudentAvatar;
