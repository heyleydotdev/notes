import type { Route } from ".react-router/types/app/routes/auth/+types/api";

import { authServer } from "~/auth/index.server";

export async function loader({ request }: Route.LoaderArgs) {
  return authServer.handler(request);
}

export async function action({ request }: Route.ActionArgs) {
  return authServer.handler(request);
}
