import "react-router";

import { createRequestHandler } from "@react-router/express";
import express from "express";

declare module "react-router" {
  export interface AppLoadContext {
    VALUE_FROM_VERCEL: string;
  }
}

const app = express();

app.disable("x-powered-by");
app.use(
  createRequestHandler({
    // @ts-expect-error - virtual module provided by React Router at build time
    build: () => import("virtual:react-router/server-build"),
    getLoadContext() {
      return {
        VALUE_FROM_VERCEL: "Hello from Vercel",
      };
    },
  }),
);

export default app;
