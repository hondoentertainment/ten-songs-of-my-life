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
        ink: {
          DEFAULT: "#0c0a09",
          soft: "#1c1917",
          muted: "#292524",
        },
        paper: {
          DEFAULT: "#f5efe6",
          warm: "#ebe2d4",
          scrap: "#f7f1e8",
        },
        amber: {
          glow: "#d97706",
          soft: "#f59e0b",
          deep: "#b45309",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pin: "0 12px 28px rgba(0,0,0,0.35)",
        lift: "0 18px 40px rgba(0,0,0,0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pin-in": {
          "0%": { opacity: "0", transform: "translateY(24px) scale(0.97)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        "pin-in": "pin-in 0.55s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
