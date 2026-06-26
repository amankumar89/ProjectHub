import { defineConfig } from "drizzle-kit";
import { DATABASE_URL } from "./src/config/env";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = WebSocket;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: Bun.env.DATABASE_URL!,
  },
});
