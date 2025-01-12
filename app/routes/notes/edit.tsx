import type { Route } from ".react-router/types/app/routes/notes/+types/edit";

import { useEffect, useState } from "react";
import {
  Link,
  redirect,
  useBlocker,
  useFetcher,
  useLoaderData,
} from "react-router";
import SuperJSON from "superjson";

import { $auth } from "~/auth/index.server";
import { Editor } from "~/components/editor";
import { LoadingFallback } from "~/components/fallbacks";
import { Button, PendingButton } from "~/components/ui/button";
import { PageHeading } from "~/components/ui/headings";
import { useDebounce } from "~/hooks/use-debounce";
import { $$notes } from "~/routes/notes/notes";
import { $notes } from "~/routes/notes/notes.server";
import { cuidSchema } from "~/utils/misc";
import { $action, ActionError } from "~/utils/misc.server";

export async function action({ request }: Route.ActionArgs) {
  return $action(() =>
    $auth.permitUsers(request, async ({ user }) => {
      const requestJSON = await request.json();
      const input = SuperJSON.deserialize<{ intent: string }>(requestJSON);

      switch (input.intent) {
        case $$notes.INTENTS.SAVE:
          return $notes.save(user.id, input);
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
      console.log(note);
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
  const debouncedState = useDebounce(state, 300);

  const isDirty = note.content !== state.content;
  const canSave = $$notes.schema
    .pick({ title: true, content: true })
    .required()
    .safeParse(state).success;

  useEffect(() => {
    $$notes.update(debouncedState.id, {
      ...debouncedState,
      updatedAt: new Date(),
    });
  }, [debouncedState]);

  useBlocker(() => {
    return (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to leave without saving?",
      )
    );
  });

  return (
    <div className="space-y-6">
      <PageHeading className="max-md:line-clamp-2 md:w-5/6 md:truncate">
        {state.title ?? "Compose a Note"}
      </PageHeading>
      <Editor
        initContent={draft.content}
        onChange={(state) => {
          setState((prev) => ({ ...prev, ...state }));
        }}
      />
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <p className="text-[0.8rem]/6 text-zinc-500">
            Status: {isDirty ? "Draft" : "Saved"}
          </p>
        </div>
        <div className="contents">
          <Button variant="outline" asChild>
            <Link to="/notes">&lsaquo; Go Back</Link>
          </Button>
          <PendingButton
            pending={fetcher.state !== "idle"}
            disabled={!isDirty || !canSave}
            onClick={() => {
              fetcher.submit(
                SuperJSON.stringify({ ...state, intent: $$notes.INTENTS.SAVE }),
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
