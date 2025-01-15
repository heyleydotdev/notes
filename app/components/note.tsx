import type { action } from "~/routes/notes/edit";
import type { MergedType } from "~/routes/notes/notes";

import { Link, useFetcher, useNavigate } from "react-router";
import SuperJSON from "superjson";

import { ConfirmDialog } from "~/components/contexts/confirm/dialog";
import { useConfirmDialog } from "~/components/contexts/confirm/use-dialog";
import { Icons } from "~/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown";
import { $$notes } from "~/routes/notes/notes";
import { noteTime } from "~/utils/misc";

const NoteCard: React.FC<{ note: MergedType }> = ({ note }) => {
  const title = note.title ?? "Empty";
  const content = note.preview ?? "No additional text";
  const updatedAt = noteTime(note.updatedAt);

  return (
    <div className="relative isolate flex min-h-48 cursor-default flex-col gap-y-1.5 overflow-hidden rounded-xl border bg-white p-6 shadow-sm ring-border-50 transition-colors hover:bg-zinc-50 [&:has(a:focus)]:ring">
      <Link to={`/notes/${note.id}`} className="absolute inset-0 z-0" />
      <h4
        className="flex items-center gap-1 text-sm/6 font-semibold text-zinc-900"
        title={title}
      >
        <NoteStatus isDraft={note.type === "draft"} />
        <span className="flex-1 truncate">{title}</span>
      </h4>
      <p className="line-clamp-3 flex-1 text-sm/6">{content}</p>
      <p className="mt-2 grid grid-cols-[1fr_auto] text-[0.8rem]/6 text-zinc-500">
        <span>{updatedAt}</span>
        <NoteOptions id={note.id}>
          <button className="z-10 -m-2 inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-black/5 hover:text-zinc-900 focus:outline-none focus-visible:ring focus-visible:ring-border-100 data-[state=open]:bg-black/5">
            <Icons.ellipsis className="size-4" />
          </button>
        </NoteOptions>
      </p>
    </div>
  );
};

const NoteStatus: React.FC<{ isDraft: boolean }> = ({ isDraft }) => {
  if (!isDraft) {
    return null;
  }

  return (
    <span className="flex-none" title="Draft">
      <Icons.dot className="-ml-1.5 size-5 text-yellow-400" />
    </span>
  );
};

const NOTE_OPTIONS_SIDE = {
  left: { side: "left", align: "start" },
  bottom: { side: "bottom", align: "end" },
} as const;

interface NoteOptionsProps {
  id: MergedType["id"];
  side?: keyof typeof NOTE_OPTIONS_SIDE;
  isOnEdit?: boolean;
}

const NoteOptions: React.FC<React.PropsWithChildren<NoteOptionsProps>> = ({
  id,
  side = "left",
  isOnEdit,
  children,
}) => {
  const confirm = useConfirmDialog();
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof action>({ key: `delete-${id}` });

  const _onDelete = async () => {
    await fetcher.submit(
      SuperJSON.stringify({ intent: $$notes.intents.DELETE }),
      {
        action: `/notes/${id}`,
        method: "POST",
        encType: "application/json",
      },
    );
    if (isOnEdit) {
      navigate("/notes");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent {...NOTE_OPTIONS_SIDE[side]}>
          {!isOnEdit && (
            <DropdownMenuItem asChild>
              <Link to={`/notes/${id}`}>Edit</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600 focus:bg-red-50"
            onClick={confirm.open}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog {...confirm} onContinue={_onDelete} />
    </>
  );
};

export { NoteCard, NoteOptions };
