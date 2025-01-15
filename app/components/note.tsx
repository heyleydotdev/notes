import type { MergedType } from "~/routes/notes/notes";

import { Link } from "react-router";

import { Icons } from "~/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown";
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
        <NoteOptions id={note.id} />
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

const NoteOptions: React.FC<{ id: MergedType["id"] }> = ({ id }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="z-10 -mx-1 -my-1 inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 hover:text-zinc-900 focus:outline-none focus-visible:ring focus-visible:ring-border-100 data-[state=open]:bg-black/5">
        <Icons.ellipsis className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem asChild>
          <Link to={`/notes/${id}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 focus:bg-red-50">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { NoteCard };
