# Plan de migration — Zendō → React + TypeScript + Vite

> ⚠️ **Plan historique.** Ce document visait une migration **à parité** avec
> l'app mobile (y compris les corrections de bugs §5.2). La v2 réellement livrée
> a resserré le périmètre et n'a pas repris plusieurs fonctionnalités listées
> ici. Les « corrections de bugs » de features retirées sont caduques. État réel
> et écarts : [`v2-scope.md`](./v2-scope.md).

> Suite de [`migration-audit.md`](./migration-audit.md). Décisions validées le 2026-11-03 (voir §7 de l'audit).
> **Ce document est un plan.** Aucune implémentation n'a démarré. Il décrit l'ordre des phases, la structure cible et la stratégie de réécriture.

**Contraintes directrices** : mobile-first (portrait) · `react-router` · swipe entre onglets préservé · bugs existants corrigés · le Web remplace la cible (nettoyage natif) · PWA/offline + mode sombre reportés · pas de sur-ingénierie.

---

## 0. Principes de séquençage

1. **Du socle vers l'UI** : d'abord le projet Vite + la couche pure (données, store, utils) qui ne dépend d'aucune primitive native, puis les ponts natifs, puis les écrans.
2. **Vérifiable à chaque phase** : chaque phase se termine par un état qui compile (`tsc --noEmit`) et, quand c'est pertinent, un écran visible dans le navigateur.
3. **Nettoyage natif en dernier** : on supprime la config Expo/RN une fois le Web autonome, pour garder une référence fonctionnelle le plus longtemps possible.
4. **Bugs corrigés au passage** : chaque correction §5.2 de l'audit est traitée dans la phase du domaine concerné (traçée ci-dessous).

---

## 1. Structure cible du projet

```
zendo/
├── index.html                 # entrée Vite (remplace index.tsx + registerRootComponent)
├── vite.config.ts             # plugin React, alias src/*, (plugin Tailwind)
├── tsconfig.json              # strict:true, paths src/*
├── tailwind.config.js         # réutilise PALETTE
├── postcss.config.js
├── package.json               # dépendances Web uniquement
├── public/                    # favicon
└── src/
    ├── main.tsx               # createRoot + <App/>
    ├── App.tsx                # providers + <RouterProvider/>
    ├── router.tsx             # définition des routes react-router
    ├── data/
    │   ├── storage.types.ts   # ← réutilisé quasi tel quel
    │   └── storage.ts         # ← adaptateur localStorage (même API publique)
    ├── store/
    │   ├── AppDataContext.tsx # ← réutilisé (appels storage inchangés en signature)
    │   └── useAppData.tsx     # ← réutilisé tel quel
    ├── domains/               # mêmes domaines ; composants réécrits DOM
    │   ├── meditation/ activity/ timeline/ quotes/ settings/ shared/
    ├── assets/
    │   ├── fonts/ *.otf        # ← récupérés
    │   └── sounds/ *.mp3       # ← récupérés
    ├── theme/palette.ts       # ← inchangé
    └── styles/index.css       # @tailwind + @font-face
```

---

## 2. Phases de migration

### Phase 1 — Socle Vite (projet qui démarre)

- Scaffolder la structure Vite + React-TS **dans le dépôt** (cohabitation temporaire avec la config RN, qui sera retirée en Phase 9).
- `index.html`, `src/main.tsx`, `vite.config.ts` (alias `src/*`), `tsconfig.json` (`strict`, `paths`).
- Tailwind CSS classique + PostCSS ; `src/styles/index.css` avec `@tailwind` + `@font-face` (SF Pro Light/Semibold/Bold depuis `src/assets/fonts`).
- Réutiliser `theme/palette.ts` et porter `tailwind.config.js` (presets web, suppression du preset NativeWind, mapping des couleurs/`fontFamily`).
- **Jalon** : `npm run dev` affiche une page blanche stylée ; `tsc --noEmit` OK.

### Phase 2 — Couche de données (persistance)

- Récupérer `storage.types.ts` **tel quel** (types purs).
- Réécrire `storage.ts` : adaptateur **`localStorage`** conservant l'API publique (`getItem/setItem` générique typé, CRUD sessions/quotes/settings, `initStorageIfFirstLaunch`, defaults, semis des 5 citations).
  - IDs : `crypto.randomUUID()` (suppression de `uuid` + `react-native-get-random-values`).
  - `hasBeenLaunched` : simple clé `localStorage` (plus de booléen natif MMKV).
  - **Export** réécrit : `Blob` JSON + `<a download>` (fallback) et Web Share API si disponible.
  - **Correction bug §5.2.1** : ajouter `deleteMeditationQuote(id)` persistant (manquant aujourd'hui).
- **Jalon** : tests unitaires rapides du round-trip storage (via Vitest, cf. Phase 8) ; `tsc` OK.

### Phase 3 — État global

- Porter `AppDataContext.tsx` + `useAppData.tsx` (quasi inchangés).
- **Correction bug §5.2.1** : brancher `deleteQuote` sur la nouvelle fonction storage (persistance effective).
- **Jalon** : provider montable, state hydraté depuis `localStorage`.

### Phase 4 — Ponts natifs (hooks/services)

- **Audio** — réécrire `useSoundPlayer` sur `HTMLAudioElement` (API publique `playSound/stopSound` conservée) ; préchargement des 10 `.mp3` (imports Vite) ; **déverrouillage audio au premier geste utilisateur** (contournement autoplay iOS).
- **Minuteur** — réécrire `useSessionTimer` avec **ancrage `Date.now()`** (fiabilité onglet inactif). **Correction bug §5.2** : intervalle non recréé à chaque tick.
- **Capacités d'appareil** (dégradation gracieuse, feature-detection) :
  - Vibration → `navigator.vibrate` (no-op si absent, ex. iOS Safari).
  - Keep-awake → `navigator.wakeLock` (acquire pendant la séance, release au démontage ; no-op si absent).
- **Jalon** : hooks testables isolément ; `tsc` OK.

### Phase 5 — Primitives & composants partagés (DOM)

- Mini-couche d'équivalents DOM si utile (ou conversion directe) : `View→div`, `Text/CustomText→span/p` (police via classes), `Pressable/Touchable→button`, `Modal→<dialog>`/overlay, `TextInput→input/textarea`.
- Porter `shared/` : `CustomText`, `CustomAlert`, `ConfirmationModal`, `WeatherIcon` (→ `lucide-react`), `ArrowButtons`, `HorizontalLine`, `ScreenLayout`.
- Icônes : `lucide-react-native` → **`lucide-react`** (parité d'API).
- `date.utils`, `common.utils` : réutilisés tels quels.
- **Jalon** : composants partagés rendus dans une page de démo ; `tsc` OK.

### Phase 6 — Navigation (react-router + swipe)

- `router.tsx` : routes alignées sur `screenNames` et `navigation.types` (params `MEDITATION_TIMER`/`SUMMARY`/`DETAIL`, `QUOTE_MANAGER`).
- **Onglets swipables** : conteneur `MainTabs` en **CSS scroll-snap** horizontal (5 panneaux, HOME au centre au montage), barre masquée comme aujourd'hui.
  - Réactiver `PageIndicator` en CSS (optionnel, était désactivé).
  - Les params de navigation (ex. `meditationSession`) passent via l'état react-router / le store plutôt que par les params RN.
- **Jalon** : navigation complète entre les 5 onglets au swipe + routes plein écran (timer/résumé/détail/citations).

### Phase 7 — Réécriture des écrans par domaine

Ordre (du plus critique au plus simple) :

1. **meditation** — `HomeScreen` (+ **picker de durée maison**, roue mobile-first), `MeditationTimerScreen` (tap recentrage, play/pause, dépassement `+mm:ss`, modale stop), `FocusPointCounter` (halo **CSS keyframes**), `MeditationSummaryScreen`/`MeditationDetailScreen` + `MeditationDetail`, `InnerWeatherSelector`, `FocusChart` (**SVG DOM maison**), `MeditationList` (**correction bug §5.2.2** : clé = `item.id`). **Correction bug §5.2.3** : param route `durationSeconds` cohérent.
2. **timeline** — `Calendar` (grille lundi→dimanche, points de séance), `PixelYear` (grille 12×31, CSS grid, icônes météo).
3. **activity** — `ActivityScreen`, `MetricGroup`, `useMeditationMetrics`, `activity.utils`. **Correction bug §5.2.4** : `calculateAverageWeeklyMeditationDuration` (format de date correct).
4. **quotes** — `QuoteManager`, `QuoteEditModal` (`<dialog>`/overlay + `textarea`), `DailyQuote` (**correction bug §5.2.5** : garde liste vide).
5. **settings** — `Settings`, `SoundSelectModal` (aperçu audio), `useSoundSelectModal`, `SettingsScreen` ; `<input type="checkbox">` stylé pour les switches ; actions export/suppression branchées.

Abandon confirmé (audit §7) : `@react-native-community/slider`, `MeditationStats`, `softDeleteMeditationSessions`.

- **Jalon** : toutes les fonctionnalités de l'inventaire §2 de l'audit opérationnelles dans le navigateur.

### Phase 8 — Tests, lint, qualité

- **Vitest** : migrer `activity.utils.spec.ts` ; ajouter des tests sur les utils corrigés (métrique hebdo, storage round-trip, `scoreToWeather`/`computeDailyInnerWeather`).
- ESLint (config web) + Prettier (conserver le tri d'imports).
- Scripts `package.json` : `dev`, `build`, `preview`, `check-typescript`, `check-eslint`, `lint`, `test`, `format`.
- **Jalon** : `lint` + `test` + `build` verts.

### Phase 9 — Nettoyage de la config native

Suppression (le Web remplace la cible) : `ios/`, `android/`, `app.json`, `eas.json`, `metro.config.js`, `babel.config.js`, `react-native.config.js`, `gesture-handler*.tsx`, `nativewind-env.d.ts`, `index.tsx`, et toutes les dépendances `expo-*` / `react-native*` / `@react-navigation/*` / `nativewind` du `package.json`.
- Mettre à jour `README.md` (instructions Vite) et `.gitignore` (`dist/`, `.vite`).
- **Jalon** : `package.json` ne contient que des dépendances Web ; `npm ci && npm run build` from scratch OK ; aucune trace RN/Expo dans le bundle.

---

## 3. Suivi des corrections de bugs (audit §5.2)

| Bug | Phase de correction |
|---|---|
| `deleteQuote` non persistant | Phase 2 + 3 |
| Clé `FlatList` via `Math.random()` | Phase 7.1 |
| Param route `duration` vs `durationSeconds` | Phase 7.1 |
| Métrique hebdo (`split('-W')`) | Phase 7.3 |
| Divisions/modulo sans garde liste vide | Phase 7.4 (et vérif transverse) |
| Dérive minuteur / intervalle recréé | Phase 4 |

---

## 4. Risques résiduels & mitigations (rappel audit §5)

- **Audio iOS** : déverrouillage au 1er geste (Phase 4) ; vérifier sur Safari réel.
- **Vibration iOS Safari** : absente → no-op assumé.
- **Keep-awake** : `wakeLock` partiel → dégradation gracieuse.
- **Swipe** : valider la fluidité scroll-snap sur mobile réel ; ajuster si nécessaire.
- **Node** : Vite requiert Node 20.19+/22.12+ → vérifier poste/CI.

---

## 5. Ordre d'exécution résumé

```
P1 Socle Vite → P2 Données → P3 Store → P4 Ponts natifs → P5 Partagés
→ P6 Navigation+swipe → P7 Écrans (meditation→timeline→activity→quotes→settings)
→ P8 Tests/lint → P9 Nettoyage natif
```

Chaque phase : compile (`tsc`), reste commitable isolément, et fait avancer un jalon vérifiable. Commits sur `feat/web-migration`.
