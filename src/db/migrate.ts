import { migrate } from "drizzle-orm/libsql/migrator";
import { db, sqliteDB } from "../db";

await migrate(db, { migrationsFolder: "./drizzle" });
