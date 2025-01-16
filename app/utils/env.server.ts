/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
import { z } from "zod";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof server> {}
  }
}

const server = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_NAME: z.string().min(1).default("Notes"),
  DATABASE_URL: z.string().url(),
  DATABASE_TABLE_PREFIX: z.string().min(1).endsWith("_"),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  GITHUB_CLIENT_ID: z.string().min(1),
  GITHUB_CLIENT_SECRET: z.string().min(1),
});

const client = server.pick({
  NODE_ENV: true,
  APP_NAME: true,
});

export const __envServer = () => {
  const { success, error, data } = server.safeParse(process.env);
  if (!success) {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }
  return data;
};

export const __envClient = () => {
  return client.parse(client);
};
