import type { Plugin } from "vite";

import { reactRouter } from "@react-router/dev/vite";
import { __envServer } from "./app/utils/env.server";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const envValidator = (): Plugin => {
  return {
    name: "env-validator",
    buildStart: () => {
      __envServer();
    },
  };
};

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [reactRouter(), tsconfigPaths(), envValidator()],
});
