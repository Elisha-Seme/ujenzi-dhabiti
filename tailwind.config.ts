import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ud-burgundy": "#8a0e33",
        "ud-burgundy-hover": "#6e0b28",
        "ud-dark": "#1c1e22",
        "ud-white": "#ffffff",
        "ud-light-gray": "#f5f5f5",
      },
      fontFamily: {
        neris: ["Neris", "Arial", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
export default config;
