import type { UserRole } from "../db/schema";

const SELF_EDITABLE_FIELDS = ["name", "email", "password"] as const;
const ADMIN_OTHER_FIELDS = [
  "name",
  "email",
  "password",
  "role",
  "status",
] as const;
const TEACHER_STUDENT_FIELDS = ["name", "email", "password"] as const;
const ADMIN_ON_ADMIN_FIELDS = ["name", "email", "password"] as const;

type AllowedFieldsResult =
  | { allowed: true; fields: readonly string[] }
  | { allowed: false; reason: string };

export default function getAllowedFields(
  isSelf: boolean,
  requesterRole: UserRole,
  targetRole: UserRole,
): AllowedFieldsResult {
  if (isSelf) {
    return { allowed: true, fields: SELF_EDITABLE_FIELDS };
  }

  if (requesterRole === "ADMIN" && targetRole === "ADMIN") {
    return { allowed: true, fields: ADMIN_ON_ADMIN_FIELDS };
  }

  if (requesterRole === "ADMIN") {
    return { allowed: true, fields: ADMIN_OTHER_FIELDS };
  }

  if (requesterRole === "TEACHER" && targetRole === "STUDENT") {
    return { allowed: true, fields: TEACHER_STUDENT_FIELDS };
  }

  return {
    allowed: false,
    reason: "You do not have permission to update this user.",
  };
}
