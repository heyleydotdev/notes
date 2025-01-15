import forge from "localforage";
import { z } from "zod";

import { cuidSchema } from "~/utils/misc";

export type MergedType = typeof schema.$infer & {
  type: "saved" | "draft";
};

const schema = z.object({
  id: cuidSchema,
  title: z.string().min(1).max(128).nullish(),
  preview: z.string().min(1).max(168).nullish(),
  content: z.string().min(1).nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

enum intents {
  SAVE = "save",
  DELETE = "delete",
}

export const $$notes = {
  intents,
  schema,
  editorSchema: schema.pick({ title: true, content: true }).required(),

  get: async (key: string) => {
    const note = await forge.getItem(key);
    return schema.safeParse(note).data;
  },

  set: async (note: typeof schema.$infer) => {
    return forge.setItem(note.id, note);
  },

  update: async (
    key: string,
    data: Omit<Partial<typeof schema.$infer>, "id">,
  ) => {
    let note = await $$notes.get(key);
    if (note && note.content !== data.content) {
      note = { ...note, ...data };
      await $$notes.set(note);
      return note;
    }
    return false;
  },

  remove: async (id: string) => {
    await forge.removeItem(id);
  },

  init: async (note: typeof schema.$infer) => {
    const exists = await $$notes.get(note.id);
    if (!exists || exists.updatedAt < note.updatedAt) {
      return $$notes.set(note);
    }
    return exists;
  },

  clean: async () => {
    const keys = await forge.keys();
    const removes = keys.map(async (_key) => {
      const note = await forge.getItem<typeof schema.$infer>(_key);
      if (note?.id && !note.title) {
        await $$notes.remove(note.id);
      }
    });
    Promise.all(removes);
  },

  merge: async (
    serverNotes: (typeof schema.$infer)[],
  ): Promise<MergedType[]> => {
    return Promise.all(
      serverNotes.map(async (note) => {
        const draft = await $$notes.get(note.id);
        if (
          draft &&
          draft.updatedAt > note.updatedAt &&
          draft.title !== undefined &&
          draft.content !== note.content
        ) {
          return { ...note, ...draft, type: "draft" };
        }
        return { ...note, type: "saved" };
      }),
    );
  },
};
