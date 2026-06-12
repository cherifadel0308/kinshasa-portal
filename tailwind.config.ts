import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        drcBlue: "#007FFF",   // Sky Blue
        drcYellow: "#F4D03F", // Yellow Accents
        drcRed: "#C0392B",    // Red Highlights
      },
    },
  },
  plugins: [],
};
export default config;
