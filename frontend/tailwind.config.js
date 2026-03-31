/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Only enable dark mode when 'dark' class is present
  safelist: [
    "animate-float-slow",
    "animate-float-medium",
    "animate-float-fast",
    "animate-pop",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};