import type { Route } from "./+types/root";

import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import { authClient } from "~/auth/client";
import { SessionProvider } from "~/components/contexts/session/provider";
import stylesheet from "~/styles/globals.css?url";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://api.fontshare.com/v2/css?f[]=switzer@500,600,700&display=swap",
  },
  { rel: "stylesheet", href: stylesheet },
];

export function meta() {
  return [
    { title: "Notes" },
    { name: "description", content: "Notes app with React Router v7" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  let setCookieHeader: string[] = [];

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: request.headers,
      onResponse(context) {
        setCookieHeader = context.response.headers.getSetCookie();
      },
    },
  });

  const headers = new Headers();
  setCookieHeader.forEach((cookie) => headers.append("Set-Cookie", cookie));

  return data({ session }, { headers });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <SessionProvider session={data.session}>
      <Outlet />
    </SessionProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
