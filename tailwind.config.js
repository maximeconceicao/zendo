/** @type {import('tailwindcss').Config} */
// Source unique des tokens de couleur/typo de l'app (plus de duplication avec un
// module TS). On consomme ces couleurs via les classes Tailwind (bg-ink/90,
// text-ink, bg-platinium…) plutôt que par des valeurs en dur dans le JSX.
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fond « platine » de l'app et noir de marque (« encre »). `ink` est pensé
        // pour être modulé par l'opacité Tailwind : bg-ink/90, border-ink/[0.08]…
        platinium: '#E5E4E2',
        ink: '#000000'
      },
      fontFamily: {
        sfLight: ['SFProDisplay-Light', 'system-ui', 'sans-serif'],
        sfSemibold: ['SFProDisplay-Semibold', 'system-ui', 'sans-serif'],
        sfBold: ['SFProDisplay-Bold', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
