import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        drcBlue: "#007FFF",
        drcYellow: "#F4D03F",
        drcRed: "#C0392B",
      },
    },
  },
  plugins: [],
};
export default config;
