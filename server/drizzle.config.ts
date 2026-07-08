import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/env";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
