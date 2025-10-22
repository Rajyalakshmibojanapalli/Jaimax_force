/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#26a69a',
        secondary: '#004d40',
      },
      willChange: {
      transform: 'transform',
    },
    },
  },
  plugins: [],
};