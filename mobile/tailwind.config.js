const colors = require('./src/design-system/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      ...colors,
    },
  },
  plugins: [],
};
