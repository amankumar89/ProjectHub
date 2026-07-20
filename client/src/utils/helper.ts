import type { Role, Status } from "@/types/global";

export const ALL_ROLES = ["ADMIN", "TEACHER", "STUDENT", "USER"] as const;

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

export const ROLE_ACCENT: Record<
  Role,
  { text: string; bg: string; dot: string; hex: string }
> = {
  ADMIN: {
    text: "text-violet-700",
    bg: "bg-violet-100",
    dot: "bg-violet-500",
    hex: "#8b5cf6",
  },
  TEACHER: {
    text: "text-sky-700",
    bg: "bg-sky-100",
    dot: "bg-sky-500",
    hex: "#0ea5e9",
  },
  STUDENT: {
    text: "text-emerald-700",
    bg: "bg-emerald-100",
    dot: "bg-emerald-500",
    hex: "#10b981",
  },
  USER: {
    text: "text-slate-700",
    bg: "bg-slate-100",
    dot: "bg-slate-400",
    hex: "#94a3b8",
  },
};

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
  USER: "User",
};

export const getInitials = (str: string) =>
  str
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const formatDate = (iso?: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const GRADE_OPTIONS = [
  { label: "Grade 1", value: "1" },
  { label: "Grade 2", value: "2" },
  { label: "Grade 3", value: "3" },
  { label: "Grade 4", value: "4" },
  { label: "Grade 5", value: "5" },
];

export const SECTION_OPTIONS = [
  { label: "A", value: "A" },
  { label: "B", value: "B" },
  { label: "C", value: "C" },
];

export function removeEmptyFields<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    }),
  ) as Partial<T>;
}
