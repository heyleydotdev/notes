import { defineConfig } from "drizzle-kit";

const getDirectConnection = () => {
  const u = new URL(process.env.DATABASE_URL);
  u.port = "5432";
  return u.toString();
};

export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.server.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: getDirectConnection(),
  },
  tablesFilter: [`${process.env.DATABASE_TABLE_PREFIX}*`],
});
