# Zendō — Web

Journal de méditation, application Web installable (PWA) en React + TypeScript +
Vite. Local, hors-ligne et mono-utilisateur : aucun backend, aucun compte,
toutes les données restent sur l'appareil.

> **Zendō v2.** Réécriture Web, issue de l'application mobile React Native /
> Expo, resserrée autour du cœur « méditer + suivre ses séances ». Le périmètre
> réellement livré (et ce qui a été volontairement laissé de côté par rapport à
> la version mobile) est décrit dans [`docs/v2-scope.md`](docs/v2-scope.md).
> Les documents [`docs/migration-audit.md`](docs/migration-audit.md) et
> [`docs/migration-plan.md`](docs/migration-plan.md) sont des pièces de
> planification **historiques** (parité mobile visée à l'origine) : s'y référer
> pour le contexte, pas pour l'état actuel.

## Fonctionnalités

- **Séance de méditation** : choix de la durée (sélecteur maison), minuteur
  plein écran fiable (ancré sur l'horloge réelle, robuste en onglet inactif),
  pause / reprise, puis enregistrement ou abandon de la séance.
- **Sons et vibrations** configurables en début et fin de séance (avec aperçu
  audio) ; écran maintenu allumé pendant la séance (Wake Lock).
- **Suivi de l'activité** : ruban annuel façon « contributions » (intensité par
  jour), et vue détaillée des séances d'un jour donné.
- **Réglages & données** : export JSON (partage ou téléchargement) et
  suppression de toutes les séances.
- **PWA** : installable, fonctionne hors-ligne, bannière de mise à jour non
  intrusive (ne coupe pas une séance en cours).

Les dégradations gracieuses (vibrations absentes sur iOS Safari, Wake Lock
partiel) sont assumées côté Web.

## Prérequis

- Node.js 20.19+ ou 22.12+ (requis par Vite).

## Démarrage

```sh
npm install
npm run dev        # serveur de développement (HMR)
```

Ouvrir l'URL affichée dans le terminal.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Serveur de développement Vite (HMR) |
| `npm run build` | Build de production (dossier `dist/`) |
| `npm run preview` | Sert le build de production localement |
| `npm run check-typescript` | Vérification des types (`tsc --noEmit`) |
| `npm run check-eslint` | Lint ESLint |
| `npm run lint` | `check-typescript` + `check-eslint` |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run format` | Formatage Prettier |

## Architecture

- **React 18 + TypeScript strict**, bundler **Vite**.
- **Tailwind CSS** pour les styles ; icônes **lucide-react**.
- **react-router** pour la navigation : **3 onglets** (Réglages, Accueil,
  Activités) swipables au doigt (CSS scroll-snap), avec rail latéral sur
  desktop. L'écran Jour et la séance s'ouvrent par-dessus.
- **État global** : React Context (`src/store`) — données applicatives
  (`AppDataContext`) et verrou « séance en cours » (`MeditationActiveContext`).
- **Persistance locale** : `localStorage` (`src/data/storage.ts`).
- **PWA** via `vite-plugin-pwa` (service worker, manifest, assets d'icônes).
- Code organisé par domaines dans `src/domains/` : `meditation`, `timeline`,
  `settings`, `shared`.
- Assets (sons `.mp3`, polices SF Pro `.otf`) dans `src/assets/`.

## Déploiement

Déployée sur **GitHub Pages** (page de projet, base `/zendo/`) via le workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) à chaque push sur
`main`. Le build copie `index.html` en `404.html` pour que les routes
react-router fonctionnent au rafraîchissement / deep-link.
