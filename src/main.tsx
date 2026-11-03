import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { App } from './App';
import { initStorageIfFirstLaunch } from 'src/data/storage';
import { registerAudioUnlock } from 'src/domains/shared/utils/soundPlayer';

// Amorce le stockage (valeurs par défaut au 1er lancement) avant le rendu,
// puis arme le déverrouillage audio (politique d'autoplay iOS/Safari).
initStorageIfFirstLaunch();
registerAudioUnlock();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Élément racine #root introuvable dans index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
