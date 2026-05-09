import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

type DrizzleDb = ReturnType<typeof drizzle>;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsDb?: DrizzleDb;
};

function getDb(): DrizzleDb {
  if (globalForDb.__arenaNextJsDb) {
    return globalForDb.__arenaNextJsDb;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  const pool =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({ connectionString: databaseUrl });

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  const db = drizzle(pool);

  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsDb = db;
  }

  return db;
}

export const db = new Proxy({} as DrizzleDb, {
  get(_, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
