import {
  boolean,
  index,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const createTable = pgTableCreator(
  (name) => `${process.env.DATABASE_TABLE_PREFIX}${name}`,
);

export const tNote = createTable(
  "note",
  {
    id: text().notNull(),
    title: text(),
    preview: text(),
    content: text(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .$onUpdateFn(() => new Date()),

    userId: text()
      .notNull()
      .references(() => tUser.id, { onDelete: "cascade" }),
  },
  (account) => [
    primaryKey({ columns: [account.id, account.userId] }),
    index().on(account.title),
    index().on(account.userId),
  ],
);
export type NoteType = typeof tNote.$inferSelect;

export const tUser = createTable(
  "user",
  {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    emailVerified: boolean().notNull(),
    image: text(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  (user) => [index().on(user.email)],
);

export const tSession = createTable(
  "session",
  {
    id: text().primaryKey(),
    expiresAt: timestamp().notNull(),
    token: text().notNull().unique(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => tUser.id),
  },
  (session) => [index().on(session.userId)],
);

export const tAccount = createTable(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => tUser.id),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().notNull(),
  },
  (account) => [index().on(account.userId)],
);

export const tVerification = createTable("verification", {
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  createdAt: timestamp(),
  updatedAt: timestamp(),
});
