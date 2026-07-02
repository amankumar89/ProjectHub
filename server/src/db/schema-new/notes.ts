import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { students } from "./students";

export const notes = pgTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    content: text("content").notNull(),
    authorId: integer("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    studentId: integer("student_id").references(() => students.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("notes_author_idx").on(table.authorId),
    index("notes_student_idx").on(table.studentId),
  ],
);
