import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Génère les icônes PWA dans public/ à partir de public/pwa-icon.svg.
// Lancer via `npm run generate-pwa-assets` (les sorties sont commitées).
// Preset minimal-2023 : favicon.ico (48), pwa-64/192/512, maskable-512, apple-180.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    // Fond platine (plutôt que transparent/blanc) pour l'icône masquable Android
    // et l'apple-touch-icon, afin de rester cohérent avec la marque.
    maskable: {
      ...minimal2023Preset.maskable,
      padding: 0.3,
      resizeOptions: { background: '#E5E4E2' }
    },
    apple: {
      ...minimal2023Preset.apple,
      padding: 0.3,
      resizeOptions: { background: '#E5E4E2' }
    }
  },
  images: ['public/pwa-icon.svg']
});
