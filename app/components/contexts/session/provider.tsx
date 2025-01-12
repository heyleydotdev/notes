import type { SessionContextValues } from "~/components/contexts/session/context";

import {
  SessionContext,
  useSession,
} from "~/components/contexts/session/context";

const SessionProvider: React.FC<
  React.PropsWithChildren<SessionContextValues>
> = ({ children, session }) => {
  return <SessionContext value={{ session }}>{children}</SessionContext>;
};

const SignedIn: React.FC<{
  children:
    | ((props: NonNullable<SessionContextValues["session"]>) => React.ReactNode)
    | React.ReactNode;
}> = ({ children }) => {
  const session = useSession();

  if (session) {
    return typeof children === "function" ? children(session) : children;
  }

  return null;
};

const SignedOut: React.FC<React.PropsWithChildren> = ({ children }) => {
  const user = useSession();

  if (user) {
    return null;
  }

  return children;
};

export { SessionProvider, SignedIn, SignedOut };
