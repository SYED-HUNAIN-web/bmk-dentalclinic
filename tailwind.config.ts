import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FCFAF6",
          100: "#F7F5EF", // Primary warm ivory
          200: "#EFECE3",
          300: "#E4E0D6", // Soft neutral border
          400: "#D3CCBE",
          500: "#B8B09F",
          DEFAULT: "#F7F5EF",
        },
        forest: {
          50: "#F2F6F4",
          100: "#DFEAE5",
          200: "#BDD5CB",
          700: "#1E5844",
          800: "#174635",
          900: "#103629", // Deep forest green
          950: "#0A241B", // Deepest forest ink
          DEFAULT: "#103629",
        },
        charcoal: {
          100: "#E6E8E7",
          300: "#B2B7B4",
          500: "#707873",
          600: "#545C57",
          700: "#38403B",
          800: "#2B322D",
          900: "#202622", // Ink charcoal
          950: "#141816",
          DEFAULT: "#202622",
        },
        brass: {
          100: "#F7F3EB",
          200: "#ECE1CE",
          300: "#D8C59E",
          400: "#CBB584",
          500: "#B69A61", // Muted brass
          600: "#9C814B",
          700: "#7E6738",
          DEFAULT: "#B69A61",
        },
        gold: {
          300: "#D8C59E",
          400: "#CBB584",
          500: "#B69A61",
          600: "#9C814B",
          DEFAULT: "#B69A61",
        },
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "-apple-system", "sans-serif"],
        editorial: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
