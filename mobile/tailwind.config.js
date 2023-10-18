// red
const accentPalette = {
  // bg
  1: '#191111',
  2: '#201314',

  // Interactive
  3: '#3B1219',
  4: '#500F1C',
  5: '#611623',

  // borders
  6: '#72232D',
  7: '#8C333A',
  8: '#B54548',

  // solid
  9: '#E5484D',
  10: '#EC5D5E',

  // text
  11: '#FF9592',
  12: '#FFD1D9',
};

const greyPalette = {
  // bg
  1: '#121113',
  2: '#1A191B',

  // Interactive
  3: '#232225',
  4: '#2B292D',
  5: '#323035',

  // borders
  6: '#3C393F',
  7: '#49474E',
  8: '#625F69',

  // solid
  9: '#6F6D78',
  10: '#7C7A85',

  // text
  11: '#B5B2BC',
  12: '#EEEEF0',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: accentPalette[11],
        primaryContrast: accentPalette[12],

        secondary: greyPalette[11],
        secondaryContrast: greyPalette[12],
      },
      backgroundColor: {
        primary: accentPalette[1],
        secondary: greyPalette[2],

        componentPrimary: accentPalette[9],
        'componentPrimary-hover': accentPalette[10],

        componentSecondary: greyPalette[9],
        'componentSecondary-hover': greyPalette[10],
      },
      borderColor: {
        primary: greyPalette[6],
        'primary-active': accentPalette[6],
        primary: greyPalette[7],
        secondary: accentPalette[7],
      },
      textColor: {
        primary: accentPalette[11],
        primaryContrast: accentPalette[12],
        secondary: greyPalette[11],
        secondaryContrast: greyPalette[12],
      },
      fill: {
        primary: accentPalette[11],
        primaryContrast: accentPalette[12],
        secondary: greyPalette[11],
        secondaryContrast: greyPalette[12],
      },
      stroke: {
        primary: accentPalette[11],
        primaryContrast: accentPalette[12],
        secondary: greyPalette[11],
        secondaryContrast: greyPalette[12],
      },
    },
  },
  plugins: [],
};
