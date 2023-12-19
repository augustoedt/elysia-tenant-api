import { type Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: { url: "file:sqlite.db" },
  schema: "./src/db/schemas/index.ts",
  verbose: true,
  strict: true,
} satisfies Config;
