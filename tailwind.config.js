/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Assistant', 'sans-serif'],
      },
      colors: {
        sage: {
          DEFAULT: '#779982',
          light: '#8EAD98',
          dark: '#5F7A68'
        },
        slate: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
          dark: '#1A252F'
        },
        offwhite: '#F8F9FA'
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
