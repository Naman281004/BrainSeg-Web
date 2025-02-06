/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-dark': '#272727',
        'custom-blue': '#536DEF',
        'custom-gray': '#0E0E0E',
        'custom-gray-light': '#8F8F8F',
        'custom-gray-light-2': '#1E1E1E',
        'custom-shadow': '#5C5C5C',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'jockey-one': ['Jockey One', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 