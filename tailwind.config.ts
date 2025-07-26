import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        gray: {
          1: "rgb(var(--gray-1))",
          2: "rgb(var(--gray-2))",
          3: "rgb(var(--gray-3))",
          4: "rgb(var(--gray-4))",
          5: "rgb(var(--gray-5))",
          6: "rgb(var(--gray-6))",
          7: "rgb(var(--gray-7))",
          8: "rgb(var(--gray-8))",
          9: "rgb(var(--gray-9))",
          10: "rgb(var(--gray-10))",
          11: "rgb(var(--gray-11))",
          12: "rgb(var(--gray-12))",
        },
        slate: {
          1: "rgb(var(--slate-1))",
          2: "rgb(var(--slate-2))",
          3: "rgb(var(--slate-3))",
          4: "rgb(var(--slate-4))",
          5: "rgb(var(--slate-5))",
          6: "rgb(var(--slate-6))",
          7: "rgb(var(--slate-7))",
          8: "rgb(var(--slate-8))",
          9: "rgb(var(--slate-9))",
          10: "rgb(var(--slate-10))",
          11: "rgb(var(--slate-11))",
          12: "rgb(var(--slate-12))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;