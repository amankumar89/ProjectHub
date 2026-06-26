import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const client = postgres(Bun.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
