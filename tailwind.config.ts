import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        truffle: {
          DEFAULT: "#5c504c",
          50: "#f8f7f7",
          100: "#e7e4e3",
          200: "#d3ceca",
          300: "#bab2ad",
          400: "#9d9694",
          500: "#7d7370",
          600: "#5c504c",
          700: "#4a403d",
          800: "#36302e",
          900: "#1f1c1a",
        },
        gold: {
          DEFAULT: "#ebd69c",
          50: "#fdfcf7",
          100: "#f9f5e8",
          200: "#f4ebd1",
          300: "#efd9b4",
          400: "#ebd69c",
          500: "#e5c87b",
          600: "#d4b35a",
          700: "#b39141",
          800: "#8c6f32",
          900: "#5d4a21",
        },
        late: {
          DEFAULT: "#c1b1a2",
          50: "#f3efec",
          100: "#e6e0da",
          200: "#dad0c7",
          300: "#cdc1b5",
          400: "#c1b1a2",
          500: "#b09a87",
          600: "#9a816c",
          700: "#7d6857",
          800: "#5e4e42",
          900: "#3f342c",
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
      fontFamily: {
        jost: ["Jost", "sans-serif"],
        ibm: ["IBM Plex Sans Thai", "sans-serif"],
      },
      backgroundImage: {
        "walnut-gradient": "linear-gradient(to right, #9e7041, #ebd69c)",
        "honeycomb-pattern": "url('/honeycomb-pattern.svg')",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

