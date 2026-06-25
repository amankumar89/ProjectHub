import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/env";

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
});
