import { db } from "../db"; // adjust to your actual db export path
import { students, type NewStudent } from "../db/schema";
import { eq, and, isNull, ilike, or, sql } from "drizzle-orm";
import type { UserStatus } from "../db/schema";

interface ListStudentsFilters {
  page: number;
  limit: number;
  grade?: string;
  section?: string;
  status?: UserStatus;
  search?: string;
}

export const findStudentById = async (id: number) => {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return student;
};

export const findStudentByRollNumber = async (rollNumber: string) => {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.rollNumber, rollNumber))
    .limit(1);
  return student;
};

export const saveStudent = async (
  data: Omit<NewStudent, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  createdBy: number,
) => {
  const existing = await findStudentByRollNumber(data.rollNumber);
  if (existing && !existing.deletedAt) {
    throw { status: 409, message: "Roll number already exists" };
  }

  const [student] = await db
    .insert(students)
    .values({ ...data, createdBy })
    .returning();

  return student;
};

export const updateStudent = async (id: number, data: Partial<NewStudent>) => {
  const existing = await findStudentById(id);
  if (!existing || existing.deletedAt) return null;

  if (data.rollNumber && data.rollNumber !== existing.rollNumber) {
    const rollTaken = await findStudentByRollNumber(data.rollNumber);
    if (rollTaken && !rollTaken.deletedAt && rollTaken.id !== id) {
      throw { status: 409, message: "Roll number already exists" };
    }
  }

  const [updated] = await db
    .update(students)
    .set(data)
    .where(eq(students.id, id))
    .returning();

  return updated;
};

export const softDeleteStudent = async (id: number) => {
  const existing = await findStudentById(id);
  if (!existing || existing.deletedAt) return null;

  const [deleted] = await db
    .update(students)
    .set({ deletedAt: new Date(), status: "DELETED" })
    .where(eq(students.id, id))
    .returning();

  return deleted;
};

export const findAllStudents = async (filters: ListStudentsFilters) => {
  const { page, limit, grade, section, status, search } = filters;
  const offset = (page - 1) * limit;

  const conditions = [isNull(students.deletedAt)];

  if (grade) conditions.push(eq(students.grade, grade));
  if (section) conditions.push(eq(students.section, section));
  if (status) conditions.push(eq(students.status, status));
  if (search) {
    conditions.push(
      or(
        ilike(students.fullName, `%${search}%`),
        ilike(students.rollNumber, `%${search}%`),
      )!,
    );
  }

  const whereClause = and(...conditions);

  const [rows, totalResult] = await Promise.all([
    db.query.students.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (students, { desc }) => desc(students.createdAt),
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(whereClause),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
