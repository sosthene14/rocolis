/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        "violet-hover": "#a19cff",
        "violet-active": "#6c63ff",
      }
    },
  },
  plugins: [],
}

