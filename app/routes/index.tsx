import { Link } from "react-router";

import { NavigationFallback } from "~/components/fallbacks";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <NavigationFallback>
      <div className="container flex min-h-full max-w-screen-md flex-col items-center justify-center gap-6 border-x text-center">
        <h1 className="font-display text-2xl font-semibold text-zinc-900 sm:text-3xl md:text-4xl">
          Notes - Built with React Router v7
        </h1>
        <p className="text-balance text-sm/6 sm:text-base">
          Notes is an open-source app for creating and organizing your notes
          with React, React Router v7, Lexical, Drizzle, and PostgreSQL
        </p>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/signin">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="https://github.com/heyleydotdev/notes" target="_blank">
              Github
            </Link>
          </Button>
        </div>
      </div>
    </NavigationFallback>
  );
}
