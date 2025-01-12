import { redirect } from "react-router";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { parse } from "cookie";

import { db } from "~/db/index.server";
import { getInitials } from "~/utils/misc";

export type AuthSession = NonNullable<
  Awaited<ReturnType<typeof authServer.api.getSession>>
>;

export type PermitUsersCallback<TReturn> = (
  session: AuthSession,
) => Promise<TReturn> | TReturn;

export type PermitUsersReturn<TReturn> = TReturn extends undefined
  ? AuthSession
  : TReturn;

export const authServer = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    modelName: "tUser",
  },
  session: {
    modelName: "tSession",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  account: {
    modelName: "tAccount",
  },
  verification: {
    modelName: "tVerification",
  },
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const initials = getInitials(user.name);
      return {
        user: { ...user, initials },
        session,
      };
    }),
  ],
});

const globals = globalThis as unknown as {
  activeGetSession: Map<string, Promise<AuthSession | null>>;
};
globals.activeGetSession ??= new Map();

export const $auth = {
  getSession: async (request: Request) => {
    const cookies = parse(request.headers.get("cookie") ?? "");
    const token = cookies["better-auth.session_token"];
    if (!token) {
      return null;
    }

    const cache = globals.activeGetSession.get(token);
    if (cache) {
      return cache;
    }

    const session = authServer.api
      .getSession({ headers: request.headers })
      .finally(() => {
        globals.activeGetSession.delete(token);
      });
    globals.activeGetSession.set(token, session);

    return session;
  },

  permitGuests: async (request: Request) => {
    const session = await $auth.getSession(request);
    if (session) {
      return redirect("/notes");
    }
  },

  permitUsers: async <TReturn = undefined>(
    request: Request,
    cb?: PermitUsersCallback<TReturn>,
  ): Promise<PermitUsersReturn<TReturn>> => {
    const session = await $auth.getSession(request);
    if (!session) {
      return redirect("/signin") as never;
    }

    if (cb) {
      return cb(session) as Promise<PermitUsersReturn<TReturn>>;
    }

    return session as PermitUsersReturn<TReturn>;
  },
};
