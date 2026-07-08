import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  users,
  type NewUser,
  type User,
  type UserRole,
  type UserStatus,
} from "../db/schema";
import { db } from "../db";
import { buildPagination, profileUser } from "../utils/helper";

const findUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
};

const createUser = async (data: NewUser) => {
  return await db.insert(users).values(data).returning();
};

const findUserById = async (id: number) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
};

const findAllUsers = async (
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
    pagination: buildPagination(page, limit, Number(count)),
  };
};

const updateUser = async (
  id: number,
  payload: Partial<User>,
): Promise<User | null> => {
  const [updatedUser] = await db
    .update(users)
    .set(payload)
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
};

const deleteUser = async (id: number): Promise<User | null> => {
  const [deletedUser] = await db
    .update(users)
    .set({
      refreshToken: null,
      deletedAt: new Date(),
      status: "DELETED",
    })
    .where(eq(users.id, id))
    .returning();
  return deletedUser;
};

const userService = {
  createUser,
  updateUser,
  findAllUsers,
  findUserByEmail,
  findUserById,
  deleteUser,
};

export default userService;
