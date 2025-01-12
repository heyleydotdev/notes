import type { Route } from ".react-router/types/app/routes/notes/+types";

import { Link, useLoaderData } from "react-router";
import { createId } from "@paralleldrive/cuid2";

import { $auth } from "~/auth/index.server";
import { EmptyPattern } from "~/components/empty-pattern";
import { LoadingFallback } from "~/components/fallbacks";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { PageHeading, PageHeadingRoot } from "~/components/ui/headings";
import { $$notes } from "~/routes/notes/notes";
import { $notes } from "~/routes/notes/notes.server";
import { noteTime } from "~/utils/misc";

type NotesType = typeof $$notes.schema.$infer & {
  type: "saved" | "draft";
};

export async function loader({ request }: Route.LoaderArgs) {
  return $auth.permitUsers(request, async ({ user }) => {
    const notes = await $notes.getAll(user.id);
    return { notes };
  });
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const { notes: _notes } = await serverLoader();
  const compose = createId();

  const notes: NotesType[] = await Promise.all(
    _notes.map(async (note) => {
      const draft = await $$notes.get(note.id);
      if (
        draft &&
        draft.updatedAt > note.updatedAt &&
        draft.title !== undefined
      ) {
        return { ...note, ...draft, type: "draft" };
      }
      return { ...note, type: "saved" };
    }),
  );

  return { compose, notes };
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return <LoadingFallback />;
}

export default function NotesPage() {
  const { compose, notes } = useLoaderData<typeof clientLoader>();

  return (
    <div>
      <PageHeadingRoot>
        <PageHeading>Your Notes</PageHeading>
        <Button asChild>
          <Link to={`/notes/${compose}`}>New Note</Link>
        </Button>
      </PageHeadingRoot>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

const NoteCard: React.FC<{
  note: NotesType;
}> = ({ note }) => {
  const isEmpty = !note.title && !note.content;

  return (
    <Link
      to={`/notes/${note.id}`}
      className="relative isolate flex min-h-48 flex-col gap-y-1.5 overflow-hidden rounded-xl border bg-white p-6 shadow-sm transition-colors hover:bg-zinc-50"
    >
      <EmptyPattern
        show={isEmpty}
        className="absolute inset-0 -z-10 size-full text-black/[.025]"
      />
      <h4
        className="flex items-center gap-1 text-sm/6 font-semibold text-zinc-900"
        title={note.title ?? undefined}
      >
        {note.type === "draft" && (
          <span className="flex-none" title="Draft">
            <Icons.dot className="-ml-1.5 size-5 text-yellow-400" />
          </span>
        )}
        <span className="flex-1 truncate">{note.title ?? "Empty"}</span>
      </h4>
      <p className="line-clamp-3 flex-1 text-sm/6">
        {note.preview ?? "No additional text"}
      </p>
      <p className="mt-2 grid grid-cols-[1fr_auto] text-[0.8rem]/6 text-zinc-500">
        <span>{noteTime(note.updatedAt)}</span>
      </p>
    </Link>
  );
};
