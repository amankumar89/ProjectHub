import { and, count, desc, eq, ilike } from "drizzle-orm";
import { db } from "../db";
import { type Note, notes } from "../db/schema";
import { buildPagination, Paginated } from "../utils/helper";

const insertNote = async (data: {
  title: string;
  body?: string;
  userId: number;
}) => {
  const [note] = await db.insert(notes).values(data).returning();
  return note;
};

const listNotesForUser = async (
  userId: number,
  params: { search?: string; page: number; limit: number },
): Promise<Paginated<Note>> => {
  const { search, page, limit } = params;
  const offset = (page - 1) * limit;

  const whereClause = search
    ? and(eq(notes.userId, userId), ilike(notes.title, `%${search}%`))
    : eq(notes.userId, userId);

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(notes)
      .where(whereClause)
      .orderBy(desc(notes.updatedAt))
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(notes).where(whereClause),
  ]);

  return { data: rows, pagination: buildPagination(page, limit, total) };
};

const findNoteById = async (id: number) => {
  const [note] = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
  return note ?? null;
};

// Ownership check lives here since every note operation needs it —
// returns null if the note doesn't exist OR belongs to a different user,
// so the controller can send one generic 404 without leaking existence to non-owners.
const findOwnedNoteById = async (id: number, userId: number) => {
  const note = await findNoteById(id);
  if (!note || note.userId !== userId) return null;
  return note;
};

const updateNoteById = async (
  id: number,
  data: Partial<{ title: string; body: string }>,
) => {
  const [updated] = await db
    .update(notes)
    .set(data)
    .where(eq(notes.id, id))
    .returning();
  return updated;
};

const deleteNoteById = async (id: number) => {
  await db.delete(notes).where(eq(notes.id, id));
};

const notesService = {
  insertNote,
  listNotesForUser,
  findNoteById,
  findOwnedNoteById,
  updateNoteById,
  deleteNoteById,
};

export default notesService;
