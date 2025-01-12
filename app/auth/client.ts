import type { authServer } from "~/auth/index.server";

import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof authServer>()],
});
