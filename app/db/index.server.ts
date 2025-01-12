import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "~/db/schema.server";

const globals = globalThis as unknown as {
  database: postgres.Sql | undefined;
};

globals.database ??= postgres(process.env.DATABASE_URL);

export const db = drizzle(globals.database, { schema });
