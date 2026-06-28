export const ROLE_STYLE: Record<Role, string> = {
  ADMIN: "bg-violet-100 text-violet-700 border-violet-200",
  TEACHER: "bg-sky-100 text-sky-700 border-sky-200",
  STUDENT: "bg-emerald-100 text-emerald-700 border-emerald-200",
  USER: "bg-gray-100 text-gray-600 border-gray-200",
};

export const STATUS_STYLE: Record<Status, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-gray-100 text-gray-500 border-gray-200",
  BLOCKED: "bg-red-100 text-red-600 border-red-200",
  DELETED: "bg-zinc-100 text-zinc-400 border-zinc-200",
};

export const STATUS_DOT: Record<Status, string> = {
  ACTIVE: "bg-emerald-500",
  INACTIVE: "bg-gray-400",
  BLOCKED: "bg-red-500",
  DELETED: "bg-zinc-400",
};

export const ROLE_OPTIONS: { label: string; value: Role }[] = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Teacher", value: "TEACHER" },
  { label: "Student", value: "STUDENT" },
];

export const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Deleted", value: "DELETED" },
];
