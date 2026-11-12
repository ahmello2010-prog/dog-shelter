/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./js/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shelter: {
          50: '#fdf8f4',
          100: '#faeee5',
          200: '#f5d9c7',
          300: '#eebfa1',
          400: '#e4996e',
          500: '#dc7a43',
          600: '#cd6130',
          700: '#ab4a24',
          800: '#893c22',
          900: '#6f3320',
        },
      },
    },
  },
  plugins: [],
};
