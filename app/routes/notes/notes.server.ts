import { and, eq } from "drizzle-orm";

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

  getAll: (userId: string) => {
    return db.query.tNote.findMany({
      where: (fields, ops) => ops.and(ops.eq(fields.userId, userId)),
      columns: { userId: false },
      orderBy: (fields, ops) => ops.desc(fields.updatedAt),
    });
  },
};
