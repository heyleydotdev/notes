import type { Route } from ".react-router/types/app/routes/notes/+types";

import { Link, useLoaderData } from "react-router";
import { createId } from "@paralleldrive/cuid2";

import { $auth } from "~/auth/index.server";
import { LoadingFallback } from "~/components/fallbacks";
import { Icons } from "~/components/icons";
import { NoteCard } from "~/components/note";
import { Button } from "~/components/ui/button";
import { PageHeading, PageHeadingRoot } from "~/components/ui/headings";
import { $$notes } from "~/routes/notes/notes";
import { $notes } from "~/routes/notes/notes.server";

export async function loader({ request }: Route.LoaderArgs) {
  return $auth.permitUsers(request, async ({ user }) => {
    const notes = await $notes.getAll(user.id);
    return { notes };
  });
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const compose = createId();

  const { notes: serverNotes } = await serverLoader();
  const notes = await $$notes.merge(serverNotes);

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
        <EmptyFallback />
      </div>
    </div>
  );
}

const EmptyFallback: React.FC = () => {
  const { notes } = useLoaderData<typeof clientLoader>();

  if (notes.length > 0) {
    return null;
  }

  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-xl border border-dashed bg-zinc-50 p-6 py-16 text-center">
      <span className="size-8 rounded-full border border-dashed border-border-150 bg-zinc-100 p-1 text-zinc-500">
        <Icons.empty className="size-full" />
      </span>
      <p className="mt-1.5 text-sm/6 text-zinc-500">No notes found</p>
    </div>
  );
};
