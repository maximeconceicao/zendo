import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// HTTPS local opt-in (PWA_HTTPS=1) : un service worker ne s'enregistre pas en HTTP
// sur une IP LAN. Utiliser `npm run preview:https` pour tester l'install/offline
// sur un vrai téléphone (accepter le certificat auto-signé).
const httpsEnabled = process.env.PWA_HTTPS === '1';

// Déployée sur GitHub Pages en tant que page de projet :
// https://maximeconceicao.github.io/zendo/. Tous les chemins absolus (assets,
// manifest PWA, scope du service worker, routeur) sont dérivés de cette base
// pour garder une seule source de vérité.
const base = '/zendo/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    ...(httpsEnabled ? [basicSsl()] : []),
    VitePWA({
      // La bannière PwaUpdatePrompt propose la mise à jour : pas de reload
      // automatique qui couperait une session de méditation en cours.
      registerType: 'prompt',
      includeAssets: [
        'favicon.ico',
        'pwa-icon.svg',
        'apple-touch-icon-180x180.png'
      ],
      manifest: {
        id: base,
        name: 'Zendō — Journal de méditation',
        short_name: 'Zendō',
        description:
          'Journal de méditation : minuteur de séance et suivi de vos sessions.',
        lang: 'fr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#E5E4E2',
        theme_color: '#E5E4E2',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Précache l'app shell + polices + sons pour un fonctionnement hors-ligne.
        globPatterns: ['**/*.{js,css,html,otf,woff2,mp3,png,svg,ico}'],
        // Les polices .otf font ~2,3 Mo (> limite Workbox par défaut de 2 Mio).
        maximumFileSizeToCacheInBytes: 3_000_000,
        // SPA : toute navigation retombe sur index.html (React Router).
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true
      },
      devOptions: { enabled: false }
    })
  ],
  resolve: {
    alias: {
      // Permet de conserver les imports absolus `src/...` du code existant.
      src: fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true
  }
});
