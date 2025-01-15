import { and, eq, isNotNull, isNull } from "drizzle-orm";

import { db } from "~/db/index.server";
import { tNote } from "~/db/schema.server";
import { $$notes } from "~/routes/notes/notes";

export const $notes = {
  init: async (id: string, userId: string) => {
    return db.query.tNote
      .findFirst({
        where: (fields, ops) =>
          ops.and(ops.eq(fields.id, id), ops.eq(fields.userId, userId)),
      })
      .then((result) => {
        if (!result) {
          return db
            .insert(tNote)
            .values({ id: id, userId: userId })
            .returning()
            .then((res) => res[0]);
        }
        return result;
      });
  },

  getAll: async (userId: string) => {
    await db
      .delete(tNote)
      .where(and(eq(tNote.userId, userId), isNull(tNote.title)));
    return db.query.tNote.findMany({
      where: (fields, ops) =>
        ops.and(ops.eq(fields.userId, userId), isNotNull(fields.title)),
      columns: { userId: false },
      orderBy: (fields, ops) => ops.desc(fields.updatedAt),
    });
  },

  save: async (userId: string, input: unknown) => {
    const data = $$notes.schema.parse(input);

    await db
      .update(tNote)
      .set({
        title: data.title,
        preview: data.preview,
        content: data.content,
      })
      .where(and(eq(tNote.id, data.id), eq(tNote.userId, userId)));

    return { saved: true };
  },

  delete: (userId: string, id: string) => {
    return db
      .delete(tNote)
      .where(and(eq(tNote.id, id), eq(tNote.userId, userId)))
      .returning({ deleted: tNote.id });
  },
};
