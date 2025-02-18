const { PALETTE } = require('./src/theme/palette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        platinium: PALETTE.background.light
      },
      fontFamily: {
        sfLight: ['SFProDisplay-Light']
      }
    }
  },
  plugins: []
};
