import type { AuthSession } from "~/auth/index.server";

import { createContext, use } from "react";

export type SessionContextValues = {
  session?: AuthSession | null;
};

export const SessionContext = createContext<SessionContextValues>(
  {} as SessionContextValues,
);

export const useSession = () => {
  const { session } = use(SessionContext);
  return session;
};
