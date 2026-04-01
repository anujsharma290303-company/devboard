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
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22d3ee',
          dark: '#0891b2',
          light: '#67e8f9',
        },
        background: {
          DEFAULT: '#070b12',
        },
        surface: {
          DEFAULT: '#121a26',
        },
        navbar: {
          DEFAULT: '#0b1320',
        },
        sidebar: {
          DEFAULT: '#09101b',
          board: '#101a2a',
        },
        border: {
          DEFAULT: '#2a3b57',
        },
        text: {
          primary: '#f6fbff',
          secondary: '#d2e7ff',
          muted: '#91abc7',
        },
        priority: {
          high: '#fb7185',
          medium: '#f59e0b',
          low: '#2dd4bf',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        sm: '0 2px 10px 0 rgb(2 8 20 / 0.45)',
        md: '0 12px 30px 0 rgb(2 8 20 / 0.58)',
        lg: '0 24px 56px 0 rgb(2 8 20 / 0.66)',
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};