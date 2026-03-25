/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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