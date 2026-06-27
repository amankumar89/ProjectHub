import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  users,
  type NewUser,
  type User,
  type UserRole,
  type UserStatus,
} from "../db/schema";
import { db } from "../db";
import { profileUser } from "../utils/helper";

export const findUserByEmail = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email)).limit(1);
};

export const createUser = async (data: NewUser) => {
  return await db.insert(users).values(data).returning();
};

export const updateUser = async (id: number, data: Partial<NewUser>) => {
  return await db.update(users).set(data).where(eq(users.id, id)).returning();
};

export const findUserById = async (id: number) => {
  return await db.select().from(users).where(eq(users.id, id)).limit(1);
};

export const findAllUsers = async (
  page: number,
  limit: number,
  offset: number,
  search: keyof Partial<User>,
  role: UserRole,
  status: UserStatus,
  sortBy: keyof Partial<User>,
  order: "asc" | "desc",
) => {
  // multiple where conditons
  const conditions = [];

  if (role) {
    conditions.push(eq(users.role, role));
  }

  if (status) {
    conditions.push(eq(users.status, status));
  }

  if (search) {
    conditions.push(
      or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)),
    );
  }

  // Sort column whitelist
  const sortableColumns = {
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    status: users.status,
    lastLogin: users.lastLogin,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  } as const;

  const sortColumn =
    sortableColumns[sortBy as keyof typeof sortableColumns] || users.createdAt;

  const orderBy = order === "asc" ? asc(sortColumn) : desc(sortColumn);

  const allUsers = await db
    .select()
    .from(users)
    .where(conditions?.length ? and(...conditions) : undefined)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Count
  const [{ count }] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined);

  return {
    users: allUsers.map((user) => profileUser(user)),
    total: Number(count),
    page,
    limit,
    totalPages: Math.ceil(Number(count) / limit),
  };
};
