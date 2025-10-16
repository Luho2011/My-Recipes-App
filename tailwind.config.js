/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        funnel: ['var(--font-funnel)', 'sans-serif'],
        londrina: ['var(--font-londrina)', 'cursive'],
      },
    },
  },
  plugins: [],
};