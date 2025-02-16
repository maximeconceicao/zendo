/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        platinium: '#E8E8E8'
      },
      fontFamily: {
        sfLight: ['SFProDisplay-Light']
      }
    }
  },
  plugins: []
};
