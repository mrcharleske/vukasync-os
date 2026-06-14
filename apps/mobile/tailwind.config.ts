import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./App.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        vukasync: {
          background: "#f8fafc",
          foreground: "#0f172a",
          primary: "#2563eb",
          muted: "#64748b",
          surface: "#ffffff"
        }
      }
    }
  }
};

export default config;
