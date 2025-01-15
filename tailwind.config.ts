import type { Config } from "tailwindcss";

import { withTV } from "tailwind-variants/transformer";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      screens: { lg: "64rem" },
      padding: "var(--container-px)",
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        display: ["switzer", ...fontFamily.sans],
      },
      colors: () => ({
        border: {
          50: `#0000000D`,
          100: `#0000001A`,
          150: `#00000026`,
          200: `#00000033`,
        },
      }),
      borderColor: ({ theme }) => ({
        DEFAULT: theme("colors.border[100]"),
      }),
      animation: {
        "fade-in":
          "fade-in var(--duration, 200ms) theme(transitionTimingFunction.out)",
        "fade-out":
          "fade-out var(--duration, 200ms) theme(transitionTimingFunction.in)",
        "zoom-in":
          "zoom-in var(--duration, 200ms) theme(transitionTimingFunction.out)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "zoom-in": {
          from: {
            opacity: "0",
            transform: "scale(.95)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

export default withTV(config);
