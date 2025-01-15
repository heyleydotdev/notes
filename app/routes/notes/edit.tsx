import type { Route } from ".react-router/types/app/routes/notes/+types/edit";
import type { EditorOnChangeState } from "~/components/editor";

import { useState } from "react";
import {
  Link,
  redirect,
  useBlocker,
  useFetcher,
  useLoaderData,
} from "react-router";
import SuperJSON from "superjson";
import { useDebouncedCallback } from "use-debounce";

import { $auth } from "~/auth/index.server";
import { Editor } from "~/components/editor";
import { LoadingFallback } from "~/components/fallbacks";
import { Icons } from "~/components/icons";
import { NoteOptions } from "~/components/note";
import { Button, PendingButton } from "~/components/ui/button";
import { PageHeading } from "~/components/ui/headings";
import { useBeforeUnload } from "~/hooks/use-before-unload";
import { $$notes } from "~/routes/notes/notes";
import { $notes } from "~/routes/notes/notes.server";
import { cuidSchema, useInferAction } from "~/utils/misc";
import { $action, ActionError } from "~/utils/misc.server";

export async function action({ request, params }: Route.ActionArgs) {
  return $action(() =>
    $auth.permitUsers(request, async ({ user }) => {
      const requestJSON = await request.json();
      const input = SuperJSON.deserialize<{ intent: string }>(requestJSON);

      switch (input.intent) {
        case $$notes.intents.SAVE:
          return $notes.save(user.id, input);
        case $$notes.intents.DELETE:
          return $notes.delete(user.id, params.id);
        default:
          throw new ActionError("Unknown action");
      }
    }),
  );
}

export async function loader({ request, params }: Route.LoaderArgs) {
  return $auth.permitUsers(request, async ({ user }) => {
    if (!cuidSchema.safeParse(params.id).success) {
      return redirect("/notes");
    }

    const note = await $notes.init(params.id, user.id);
    if (!note) {
      return redirect("/notes");
    }

    return { id: params.id, note };
  });
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const data = await serverLoader();
  const draft = await $$notes.init(data.note);

  return { ...data, draft };
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <LoadingFallback />;
}

export default function EditPage() {
  const { note, draft } = useLoaderData<typeof clientLoader>();
  const fetcher = useFetcher<typeof action>();

  const [state, setState] = useState<typeof $$notes.schema.$infer>(draft);
  const [valid, setValid] = useState(
    $$notes.editorSchema.safeParse(state).success,
  );

  const isDeleted = useDeleted();
  const isEmpty = note.title === null;
  const isDirty = note.content !== state.content;

  const onChangeHandler = useDebouncedCallback(
    async (editor: EditorOnChangeState) => {
      const valid = $$notes.editorSchema.safeParse(editor).success;
      setValid(valid);

      const newState: typeof $$notes.schema.$infer = {
        ...state,
        ...editor,
        updatedAt: new Date(),
      };
      setState(newState);

      if (valid) {
        $$notes.update(state.id, newState);
      }
    },
    300,
  );

  useBlocker(() => {
    return (
      !isDeleted &&
      (isEmpty || isDirty) &&
      !window.confirm(
        isEmpty
          ? "Save your changes to keep this note. Leaving the page will discard it."
          : "You have unsaved changes. Are you sure you want to leave without saving?",
      )
    );
  });

  useBeforeUnload(isEmpty || isDirty);

  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-6 max-md:flex-col">
        <PageHeading className="max-md:line-clamp-2 md:basis-5/6 md:truncate">
          {state.title ?? "Compose a Note"}
        </PageHeading>
        <NoteOptions id={note.id} side="bottom" isOnEdit>
          <Button variant="outline" className="gap-1 max-md:ml-auto">
            Options
            <Icons.cdown className="mt-0.5 !size-3" />
          </Button>
        </NoteOptions>
      </div>

      <Editor initContent={draft.content} onChange={onChangeHandler} />

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <NoteStatus isDirty={isDirty} />
        </div>
        <div className="contents">
          <Button variant="outline" asChild>
            <Link to="/notes">&lsaquo; Go Back</Link>
          </Button>
          <PendingButton
            pending={fetcher.state !== "idle"}
            disabled={!isDirty || !valid}
            onClick={() => {
              fetcher.submit(
                SuperJSON.stringify({ ...state, intent: $$notes.intents.SAVE }),
                { method: "POST", encType: "application/json" },
              );
            }}
          >
            Save Changes
          </PendingButton>
        </div>
      </div>
    </div>
  );
}

const NoteStatus: React.FC<{ isDirty: boolean }> = ({ isDirty }) => (
  <p className="flex w-max items-center gap-0.5 rounded-full border border-border-50 bg-zinc-50 pl-1.5 pr-2.5 text-[0.8rem]/6 text-zinc-500">
    <span>
      <Icons.dot
        data-draft={isDirty}
        className="-ml-1 size-5 text-green-500 data-[draft=true]:text-yellow-400"
      />
    </span>
    <span>{isDirty ? "Draft" : "Saved"}</span>
  </p>
);

const useDeleted = () => {
  const { id } = useLoaderData<typeof clientLoader>();

  const fetcher = useFetcher<typeof action>({ key: `delete-${id}` });
  const { data } = useInferAction(fetcher.data);

  return !!data && "deleted" in data && data.deleted === id;
};
