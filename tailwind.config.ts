import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        elba: {
          primary: "#072111",
          secondary: "#558B33",
          tertiary: "#CD7309",
          charcoal: "#1A1A1A",
          "primary-light": "#0E3A1D",
          "secondary-light": "#6FA844",
          "tertiary-light": "#E8891F",
          surface: "#F5F5F0",
          "surface-dark": "#E8E8E0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cabinet Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;