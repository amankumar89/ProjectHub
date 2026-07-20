import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { students } from "../db/schema";
import { buildPagination, Paginated } from "../utils/helper";
import type { Student } from "../db/schema";
import { db } from "../db";

const findStudentByStudentId = async (studentId: string) => {
  const [row] = await db
    .select()
    .from(students)
    .where(eq(students.studentId, studentId))
    .limit(1);
  return row ?? null;
};

const findStudentByEmail = async (email: string) => {
  const [row] = await db
    .select()
    .from(students)
    .where(eq(students.email, email))
    .limit(1);
  return row ?? null;
};

const insertStudent = async (data: {
  studentId: string;
  name: string;
  email?: string;
  phone?: string;
  enrolledAt: string; // YYYY-MM-DD
  addedBy: number;
}) => {
  const [student] = await db.insert(students).values(data).returning();
  return student;
};

const findStudentById = async (id: number) => {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);
  return student ?? null;
};

const findActiveStudentById = async (id: number) => {
  const student = await findStudentById(id);
  if (!student || !student.isActive) return null;
  return student;
};

const listStudents = async (params: {
  search?: string;
  page: number;
  limit: number;
}): Promise<Paginated<Student>> => {
  const { search, page, limit } = params;
  const offset = (page - 1) * limit;

  const whereClause = search
    ? and(
        eq(students.isActive, true),
        or(
          ilike(students.name, `%${search}%`),
          ilike(students.studentId, `%${search}%`),
        ),
      )
    : eq(students.isActive, true);

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(students)
      .where(whereClause)
      .orderBy(desc(students.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(students).where(whereClause),
  ]);

  return { data: rows, pagination: buildPagination(page, limit, total) };
};

const updateStudentById = async (
  id: number,
  data: Partial<{
    studentId: string;
    name: string;
    email: string;
    phone: string;
    enrolledAt: string;
  }>,
) => {
  const [updated] = await db
    .update(students)
    .set(data)
    .where(eq(students.id, id))
    .returning();
  return updated;
};

const softDeleteStudentById = async (id: number) => {
  const [deleted] = await db
    .update(students)
    .set({ isActive: false })
    .where(eq(students.id, id))
    .returning();
  return deleted;
};

const studentsService = {
  findStudentByStudentId,
  insertStudent,
  findStudentById,
  findActiveStudentById,
  listStudents,
  updateStudentById,
  softDeleteStudentById,
  findStudentByEmail,
};

export default studentsService;
