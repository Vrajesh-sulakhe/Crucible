import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#050505",
          subtle: "#0a0a0a",
          card: "#0d0d0d",
          muted: "#111111",
        },
        surface: {
          DEFAULT: "rgba(255, 255, 255, 0.02)",
          hover: "rgba(255, 255, 255, 0.04)",
          active: "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.06)",
        },
        accent: {
          blue: "#3b82f6",
          sky: "#0ea5e9",
          indigo: "#6366f1",
          emerald: "#10b981",
          amber: "#f59e0b",
          orange: "#f97316",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "monospace",
        ],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "28px",
      },
      boxShadow: {
        "glow-emerald": "0 0 40px -10px rgba(16, 185, 129, 0.15)",
        "glow-blue": "0 0 40px -10px rgba(59, 130, 246, 0.15)",
        "glow-amber": "0 0 40px -10px rgba(245, 158, 11, 0.15)",
        "subtle": "0 2px 20px -4px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
