import { Link } from "react-router";

import { Icons } from "~/components/icons";
import UserNavigation from "~/components/user-nav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-14 border-b bg-zinc-50">
      <div className="container flex h-full items-center justify-between">
        <Link to="/notes" className="inline-flex">
          <span className="pointer-events-none inline-flex select-none items-center gap-1.5 font-display font-semibold uppercase tracking-wider text-zinc-900">
            <Icons.notes className="size-4" />
            Notes
          </span>
        </Link>
        <UserNavigation />
      </div>
    </header>
  );
}
