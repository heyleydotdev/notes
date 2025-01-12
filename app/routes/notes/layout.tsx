import { Outlet } from "react-router";

import { NavigationFallback } from "~/components/fallbacks";
import SiteHeader from "~/components/site-header";

export default function NotesLayout() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="container flex flex-1 flex-col pb-24 pt-10">
        <NavigationFallback>
          <Outlet />
        </NavigationFallback>
      </main>
    </div>
  );
}
