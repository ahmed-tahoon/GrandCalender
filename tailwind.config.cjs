/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'grandkit': {
          100: '#eed3f0',
          200: '#daa9de',
          300: '#b17ab5',
          400: '#884a8c',
          500: '#75337a',
          600: '#67136e',
          700: '#5d0766',
          800: '#49104f',
          900: '#3f004f'
        },
        'fuchsia': {
          100: '#eed3f0',
          200: '#daa9de',
          300: '#b17ab5',
          400: '#884a8c',
          500: '#75337a',
          600: '#67136e',
          700: '#5d0766',
          800: '#49104f',
          900: '#3f004f'
        }
        },
        screens: {
            'print': { 'raw': 'print' },
        }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
      require('tailwindcss-rtl'),
      require('@tailwindcss/aspect-ratio'),
  ],
}
