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
    },
  },
  plugins: [],
} satisfies Config;

export default withTV(config);
