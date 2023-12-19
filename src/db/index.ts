import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const sqliteDB = createClient({ url: "file:sqlite.db" });
export const db = drizzle(sqliteDB);
