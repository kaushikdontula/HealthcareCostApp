import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "infinite-scroll": {
          "0%": { transform: "translateX(0)"},
          "100%": {transform: "translateX(-100%) "}
        }  
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "infinite-scroll": "infinite-scroll 10s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
