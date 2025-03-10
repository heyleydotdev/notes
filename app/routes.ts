import type { RouteConfig } from "@react-router/dev/routes";

import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),

  route("/api/auth/*", "routes/auth/api.tsx"),
  layout("routes/auth/layout.tsx", [
    route("/signin", "routes/auth/signin.tsx"),
  ]),

  layout("routes/notes/layout.tsx", [
    route("/notes", "routes/notes/index.tsx"),
    route("/notes/:id", "routes/notes/edit.tsx"),
  ]),
] satisfies RouteConfig;
