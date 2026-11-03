# Audit de migration — Zendō (React Native/Expo → React + TypeScript + Vite)

> ⚠️ **Document de planification historique (2026-11-03).** Il décrit l'app
> mobile et la **parité visée à l'origine**, pas l'état livré. La v2 Web a
> volontairement resserré le périmètre (citations, météo intérieure,
> recentrages, statistiques détaillées, Pixel Year, résumé post-séance non
> repris). Pour l'état réel, voir [`v2-scope.md`](./v2-scope.md).

> Document d'audit préalable. **Aucune modification du code applicatif ou de la configuration n'a été effectuée.** Objectif : évaluer la faisabilité et préparer la migration Web, sans démarrer l'implémentation.
>
> Date : 2026-11-03 · Branche : `feat/web-migration` · Périmètre analysé : ~3 300 lignes de TS/TSX dans `src/`.

---

## 1. Résumé de l'application existante

**Zendō** est un **journal de méditation** mobile (iOS/Android) développé avec **Expo (SDK 52) / React Native 0.76.7**, en TypeScript strict. L'application est entièrement **locale, hors-ligne et mono-utilisateur** : aucune API réseau, aucun backend, aucune authentification. Toutes les données sont persistées sur l'appareil.

Interface en **français**, orientée portrait. L'app est organisée autour de 5 « onglets » navigables **uniquement au swipe horizontal** (la barre d'onglets est masquée), avec HOME au centre :

```
 SETTINGS  ◄──  ACTIVITY  ◄──  [ HOME ]  ──►  CALENDAR  ──►  PIXEL_YEAR
```

Par-dessus ces onglets, un stack de navigation présente en plein écran les parcours « séance » (timer, résumé, détail) et la gestion des citations.

Le cœur fonctionnel est le **déroulé d'une séance de méditation** : choix de la durée → minuteur plein écran avec enregistrement des « recentrages » (focus points), sons et vibrations configurables, dépassement de durée → résumé avec « météo intérieure » (ressenti) → historisation. Autour, des vues d'analyse : calendrier mensuel, « pixel year » annuel, statistiques d'activité, et un gestionnaire de citations inspirantes.

L'app est un projet personnel (auteur unique), partant d'un template `react-navigation`, avec déjà **react-native-web activé** (bundler Metro) — mais ce mode web n'est pas la cible retenue : on migre vers une application Web **native DOM** avec Vite.

---

## 2. Inventaire fonctionnel (vérifié dans le code)

### 2.1 Parcours « séance de méditation » (cœur de l'app)

| Fonctionnalité | Présente | Détail / fichier |
|---|:--:|---|
| Choix de la durée de séance | ✅ | `HomeScreen` via un picker natif (`DateTimePicker`, roue heures/minutes, pas de 5 min, minimum 5 min). Durée encodée dans un objet `Date`. |
| Mémorisation de la dernière durée | ✅ | `userSettings.lastSelectedDurationSeconds`, défaut **1200 s (20 min)**. |
| Minuteur de séance | ✅ | `useSessionTimer` : `setInterval` 1 s, démarre **automatiquement**, `timeLeft` décroît. |
| Compte à rebours + **dépassement** | ✅ | Le minuteur **continue en négatif** après 0 ; affichage `+mm:ss` (temps « en dépassement »). |
| Pause / reprise | ✅ | Bouton play/pause ; bouton stop → modale 3 choix (Reprendre / Enregistrer / Quitter). |
| « Recentrages » (focus points) | ✅ | Tap n'importe où sur l'écran pendant la séance → enregistre `{ elapsedTime }` + feedback son/vibration. |
| Compteur visuel de recentrages animé | ✅ | `FocusPointCounter` : halo pulsant de 4 cercles concentriques (Reanimated). |
| Son de début / fin / recentrage | ✅ | Configurable, voir audio ci-dessous. Déclenché par `useEffect` sur montage, sur `timeLeft===0`, et au tap. |
| Vibration de début / fin / recentrage | ✅ | `Vibration.vibrate(pattern)` avec 3 patterns distincts (`session.constants.ts`). |
| Maintien de l'écran allumé | ✅ | `useKeepAwake()` (expo-keep-awake) pendant la séance. |
| Résumé post-séance | ✅ | `MeditationSummaryScreen` → `MeditationDetail` (mode `summary`). |
| Sélection « météo intérieure » (ressenti) | ✅ | 5 niveaux Stormy→Sunny (`InnerWeatherSelector`), persistance immédiate. |
| Graphique des recentrages/minute | ✅ | `FocusChart` (react-native-chart-kit + SVG), scroll horizontal pour longues séances. |

### 2.2 Historique, calendrier et analyse

| Fonctionnalité | Présente | Détail / fichier |
|---|:--:|---|
| Liste d'historique des séances | ✅ | `MeditationList` (FlatList), date FR, durée, icône météo. |
| Détail d'une séance passée | ✅ | `MeditationDetailScreen` + suppression (soft/hard — voir §5). |
| Calendrier mensuel | ✅ | `Calendar` : grille lundi→dimanche, point sous les jours avec séance, navigation mois. |
| « Pixel Year » (grille annuelle) | ✅ | `PixelYear` : 12 mois × 31 jours, icône météo intérieure agrégée par jour, navigation année. |
| Statistiques d'activité | ✅ | `ActivityScreen` : total sessions, temps total, moyenne hebdo, durée moyenne, offset réalisé/planifié, série en cours, plus longue série, plus longue session, total recentrages. **Pas de graphique ici** (listes label/valeur). |

### 2.3 Citations

| Fonctionnalité | Présente | Détail / fichier |
|---|:--:|---|
| Citation du jour | ✅ | `DailyQuote` sur HOME (si `showQuotes`), indexée sur le jour du mois. |
| Gestion CRUD des citations | ✅ | `QuoteManager` + `QuoteEditModal` : créer/éditer/supprimer (texte, auteur, livre). |
| 5 citations par défaut | ✅ | Semées au 1er lancement (`defaultMeditationQuotes`, en français). |

### 2.4 Préférences et données

| Fonctionnalité | Présente | Détail / fichier |
|---|:--:|---|
| Réglages sons (début/fin/recentrage) | ✅ | Activation + choix du son, avec **aperçu audio immédiat** dans la modale. |
| Réglages vibrations (début/fin/recentrage) | ✅ | 3 switches. |
| Affichage des citations | ✅ | Switch `showQuotes`. |
| Export des données (JSON) | ✅ | `exportMeditationSessions` : écrit un fichier + partage natif (expo-file-system + expo-sharing). |
| Suppression de toutes les données | ✅ | `deleteAllSessions` (hard delete) via confirmation. |
| Persistance locale | ✅ | **react-native-mmkv** (clé/valeur synchrone, valeurs JSON). |
| Polices personnalisées | ✅ | SF Pro Display (Light/Semibold/Bold) via expo-font. |

### 2.5 Fonctionnalités natives **absentes** (vérifié)

- ❌ **Pas de notifications** (aucun `expo-notifications`).
- ❌ **Pas de fondu audio (fade), pas de réglage de volume, pas de boucle** — lecture one-shot simple.
- ❌ **Pas de sons d'ambiance / musique de fond continue** — uniquement des sons ponctuels (cloches, bols…).
- ❌ Pas de backend, réseau, compte utilisateur, synchronisation cloud.
- ❌ Pas de mode sombre effectif (`userInterfaceStyle: automatic` déclaré, palette `dark` définie mais UI codée en clair).
- `MeditationStats` et `softDeleteMeditationSessions` : définis mais **non utilisés** par l'UI (voir §5).

---

## 3. Architecture et dépendances actuelles

### 3.1 Organisation du code

Architecture **par domaines** (Domain-Driven, propre et cohérente) :

```
src/
├── app/                      # App.tsx + navigation (AppNavigator, types)
├── data/                     # storage.ts (MMKV) + storage.types.ts (modèle de données)
├── store/                    # AppDataContext (React Context) + useAppData
├── domains/
│   ├── meditation/           # écrans timer/home/summary/detail, useSessionTimer, charts
│   ├── activity/             # statistiques (métriques, pas de graphe)
│   ├── timeline/             # calendrier + pixel year
│   ├── quotes/               # citation du jour + gestion CRUD
│   ├── settings/             # réglages + modale de sélection de son
│   └── shared/               # composants/hooks/utils/layout/constantes transverses
├── assets/                   # fonts (3 .otf), sounds (10 .mp3), images (png)
├── theme/palette.ts          # palette de couleurs
└── styles/global.css         # directives Tailwind (NativeWind)
```

Chaque domaine suit la même sous-structure (`screens/`, `components/`, `hooks/`, `constants/`, `utils/`, `tests/`). Cette séparation **se transpose directement** à la cible Web.

### 3.2 Gestion de l'état

- **État global** : un unique **React Context** (`AppDataContext`) hydraté depuis MMKV au montage, exposant `meditationSessions`, `userSettings`, `meditationQuotes` + leurs mutateurs. Pattern **optimistic update** (state d'abord, persistance ensuite). Pas de Redux/Zustand/MobX.
- **État local** : `useState`/`useMemo`/`useRef` dans les écrans.
- **Alias d'imports** : `src/*` (baseUrl `./`, résolution `bundler`).

### 3.3 Navigation

- **Racine** : `createStackNavigator` (`@react-navigation/stack`), `headerShown:false`, transition `fade`. Écrans : `MAIN_TABS`, `MEDITATION_TIMER`, `MEDITATION_SUMMARY`, `MEDITATION_DETAIL`, `QUOTE_MANAGER`.
- **Onglets** : `createMaterialTopTabNavigator` imbriqué, **barre masquée** (`height:0`), navigation **par swipe uniquement**, tous les écrans pré-montés (`lazy:false`).
- `PageIndicator` (indicateur de pages animé) codé mais **désactivé** (commenté).

### 3.4 Configuration, outils, build

| Aspect | Actuel |
|---|---|
| Bundler | Metro (Expo), NativeWind via `withNativeWind` |
| TypeScript | `strict: true`, `extends: expo/tsconfig.base`, `moduleResolution: bundler` |
| Styles | **NativeWind 4** (Tailwind pour RN, `className` sur composants RN) + `tailwind.config.js` branché sur `PALETTE` |
| Lint | ESLint (`eslint-config-expo`) + plugin jest |
| Format | Prettier + tri d'imports (`@trivago/prettier-plugin-sort-imports`) |
| Tests | **Jest + ts-jest** (environnement `node`). **Un seul fichier de test** : `activity.utils.spec.ts`. `jest-expo` présent mais le `jest.config.ts` utilise `ts-jest`. |
| Build mobile | EAS Build (`eas.json`), dossiers `ios/` et `android/` générés (CNG) |
| Scripts | `start/web/android/ios`, `check-typescript`, `check-eslint`, `lint`, `test`, `format` |

### 3.5 Dépendances (compatibilité Web DOM)

**Légende : 🟢 réutilisable tel quel · 🟡 à adapter / support web partiel · 🔴 à remplacer (natif RN)**

| Dépendance | Rôle | Statut cible Web | Alternative Web |
|---|---|:--:|---|
| `react`, `react-dom` | Cœur React | 🟢 | Conservé (React 18 → possibilité React 19) |
| `typescript` | Typage | 🟢 | Conservé |
| `date-fns` (+ locale fr) | Dates, calendrier, formats | 🟢 | Conservé tel quel |
| `uuid` | IDs | 🟢 | `crypto.randomUUID()` natif (supprime `uuid` + `react-native-get-random-values`) |
| `expo`, `@expo/metro-runtime`, `expo-dev-client`, `expo-splash-screen`, `expo-system-ui`, `expo-asset` | Runtime/outillage Expo | 🔴 | Supprimés (remplacés par Vite + `index.html`) |
| `react-native`, `react-native-web` | Primitives UI | 🔴 | Réécriture DOM (`View`→`div`, `Text`→`span/p`, `Pressable`→`button`, `FlatList`→`.map()`/liste, `Modal`→`<dialog>`/overlay, `TextInput`→`input/textarea`) |
| `@react-navigation/*` (stack, material-top-tabs, native, elements, bottom-tabs, native-stack) | Navigation + swipe | 🔴 | **Décision §7.** Soit `react-router`, soit routeur minimal maison. Le swipe entre onglets est à réimplémenter. |
| `react-native-pager-view`, `react-native-tab-view` | Pager des onglets | 🔴 | Swipe DOM (CSS scroll-snap ou lib légère) ou abandon du swipe |
| `nativewind` | Tailwind pour RN | 🔴 | **Tailwind CSS classique** (même `tailwind.config.js`/palette réutilisables) |
| `tailwindcss` | Moteur CSS | 🟢 | Conservé (config web standard via PostCSS) |
| `react-native-mmkv` | Persistance clé/valeur | 🔴 | **`localStorage`** (API synchrone identique en esprit) ou IndexedDB |
| `expo-av` (`Audio.Sound`) | Lecture audio | 🔴 | **`HTMLAudioElement`** / Web Audio API (natif). *(expo-av est déprécié.)* |
| `expo-font` + `.otf` SF Pro | Polices | 🔴 | `@font-face` CSS (assets `.otf` réutilisables) |
| `expo-keep-awake` | Écran allumé | 🔴/🟡 | **Screen Wake Lock API** (`navigator.wakeLock`) — support partiel |
| `Vibration` (react-native) | Vibrations | 🔴/🟡 | **`navigator.vibrate`** — **non supporté iOS Safari** |
| `expo-file-system` + `expo-sharing` | Export + partage | 🔴 | **Blob + `<a download>`** et/ou **Web Share API** (`navigator.share`) |
| `lucide-react-native` | Icônes | 🔴 | **`lucide-react`** (mêmes icônes, API quasi identique) |
| `react-native-chart-kit` + `react-native-svg` | Graphique recentrages | 🔴 | **SVG DOM maison** (recommandé, 1 seul graphe simple) ou lib légère. Éviter une grosse dépendance. |
| `react-native-reanimated` | Animations (halo, PageIndicator) | 🔴 | **CSS `@keyframes`/transitions** |
| `react-native-gesture-handler` | Gestes | 🔴 | Événements pointer DOM / scroll-snap |
| `react-native-safe-area-context` | Safe areas | 🔴 | `env(safe-area-inset-*)` CSS (surtout utile en PWA) |
| `react-native-screens`, `react-native-edge-to-edge` | Natif mobile | 🔴 | Supprimés |
| `@react-native-community/slider` | Slider | 🔴/❓ | `<input type="range">` — **vérifier l'usage réel (semble inutilisé, voir §7)** |
| `@react-native-community/datetimepicker` | Picker durée | 🔴 | `<input type="time">` ou sélecteur custom (roue) |

---

## 4. Tableau de synthèse : conserver / adapter / réécrire

| Élément | Action | Justification |
|---|:--:|---|
| **Modèle de données** (`storage.types.ts`) | ✅ **Conserver** | Types purs, aucune dépendance native. Contrat central de l'app. |
| **Logique de persistance** (`storage.ts`) | 🔁 **Adapter** | Remplacer l'instance MMKV par un adaptateur `localStorage` ; **conserver intégralement** l'API (`getItem/setItem`, CRUD sessions/quotes/settings) et la sérialisation JSON. Réécrire `export` (Blob/download). |
| **AppDataContext / useAppData** | ✅ **Conserver** (quasi tel quel) | React Context pur ; seuls les appels storage sous-jacents changent. |
| **Calculs métier** (`activity.utils`, `useMeditationMetrics`, `inner-weather.utils`, `date.utils`, `common.utils`) | ✅ **Conserver** | JS/TS pur + date-fns. Directement réutilisable (corriger les anomalies §5 au passage). |
| **Constantes** (sons, patterns vibration, inner-weather, screenNames, session) | ✅ **Conserver** | Pures. Les `require()` d'assets deviennent des imports Vite. |
| **`useSessionTimer`** | 🔁 **Adapter** (recommandé : réécrire) | `setInterval` se porte, mais **réancrer sur `Date.now()`** pour fiabilité (onglet inactif, throttling). |
| **`useSoundPlayer`** | ✍️ **Réécrire** | Remapper `expo-av` → `HTMLAudioElement`/Web Audio. API publique (`playSound/stopSound`) conservable. |
| **Tous les écrans/composants UI** | ✍️ **Réécrire (DOM)** | Primitives RN → éléments DOM, NativeWind → Tailwind CSS. La **structure et la logique** des composants sont réutilisables comme référence. |
| **Navigation** (`AppNavigator`) | ✍️ **Réécrire** | Stack + swipe-tabs → solution Web (voir §7). Conserver la carte des routes (`screenNames`, params). |
| **`FocusChart`** | ✍️ **Réécrire** | SVG DOM maison (graphe simple ligne/bezier). |
| **`FocusPointCounter` / `PageIndicator`** | ✍️ **Réécrire** | Animations Reanimated → CSS. |
| **Assets** : 10 `.mp3`, 3 `.otf`, `.png` | ✅ **Récupérer** | Réutilisés via imports Vite / `@font-face`. |
| **`palette.ts` + `tailwind.config.js`** | ✅ **Conserver** | La palette et la config Tailwind se réutilisent côté Web (adapter `presets`). |
| **Config native** (`ios/`, `android/`, `app.json`, `eas.json`, `metro.config.js`, `babel.config.js`, gesture-handler, `react-native.config.js`) | ⛔ **Abandonner (cible Web)** | Non pertinent pour Vite. À **conserver dans l'historique Git** si le mobile reste maintenu en parallèle. |
| **Test `activity.utils.spec.ts`** | ✅ **Conserver** | Logique pure ; migrable vers Vitest sans effort. |

---

## 5. Risques techniques et fonctionnels

### 5.1 Risques techniques

1. **Audio Web (iOS Safari)** — la lecture audio exige une **interaction utilisateur** pour être débloquée (autoplay policy). L'aperçu de son dans la modale et les sons début/fin déclenchés par timer peuvent être bloqués si aucune interaction préalable. **Risque de régression UX modéré**, mitigeable (déverrouillage audio au premier tap).
2. **Vibrations** — `navigator.vibrate` **n'existe pas sur iOS Safari**. Fonctionnalité **perdue sur iOS Web** (dégradation gracieuse nécessaire).
3. **Keep-awake** — `navigator.wakeLock` a un support partiel (OK Chrome/Edge, variable Safari). L'écran peut s'éteindre pendant une séance sur certains navigateurs.
4. **Fiabilité du minuteur en onglet inactif** — `setInterval` est throttlé par les navigateurs quand l'onglet n'est pas au premier plan → **dérive du décompte**. Déjà un problème latent sur mobile ; à corriger via ancrage `Date.now()`.
5. **Swipe entre onglets** — comportement central de l'UX (barre masquée). Pas d'équivalent DOM direct ; réimplémentation (scroll-snap/pointer events) avec risque de ne pas égaler la fluidité native.
6. **Partage de fichier** — Web Share API avec fichiers a un support inégal ; fallback téléchargement (`<a download>`) nécessaire.
7. **Node / environnement** — Vite 7 requiert **Node 20.19+ / 22.12+** (doc officielle). À vérifier sur le poste/CI.

### 5.2 Risques fonctionnels / anomalies repérées (code actuel)

> À décider : les **corriger pendant la migration** ou **reproduire à l'identique** pour une parité stricte.

1. **`deleteQuote` ne persiste pas** — supprime du state React mais **pas de MMKV** (pas de fonction storage correspondante). La suppression de citation **revient au redémarrage**. Bug existant à ne pas reproduire.
2. **Clé de liste non déterministe** — `MeditationList` : `keyExtractor` utilise `Math.random()` → re-rendus/perf. À corriger (`item.id`).
3. **Fallback de route incohérent** — `MeditationTimerScreen` lit `{ duration: 10 }` alors que le param est `durationSeconds`.
4. **`calculateAverageWeeklyMeditationDuration`** s'appuie sur un format `date.split('-W')[1]` (ISO-week) incohérent avec le format ISO réellement stocké (`parseISO`) → **métrique probablement erronée**.
5. **Divisions/modulo sans garde liste vide** — `DailyQuote` (`getDate() % quotes.length`) et certains calculs si aucune session.
6. **`MeditationStats` et `softDeleteMeditationSessions`** : présents dans le schéma/code mais **non utilisés** par l'UI. Clarifier s'ils doivent être portés.
7. **Mode sombre** déclaré (`automatic`) mais **non implémenté** dans l'UI. Décider s'il entre dans le périmètre Web.

### 5.3 Risques de périmètre

- **Parité stricte vs. amélioration** : certaines fonctionnalités natives (vibration iOS, keep-awake) se dégraderont sur le Web. Le niveau de parité acceptable doit être arbitré.

---

## 6. Proposition préliminaire d'architecture cible (React + TypeScript + Vite)

> Principe directeur demandé : **minimalisme, pas de sur-ingénierie**. On ne réintroduit un routeur, un state manager global ou une lib CSS que si nécessaire.

### 6.1 Socle (recommandations **documentées** par Vite)

- **Scaffolding** : `npm create vite@latest <app> -- --template react-ts` (commande officielle Vite). Fournit `index.html` à la racine comme point d'entrée, dev server + **HMR**, build de production optimisé.
- **TypeScript** : conserver `strict: true`. Reconfigurer les **alias** (`src/*`) via `resolve.alias` (Vite) + `paths` (tsconfig).
- **Assets** (doc Vite) : les `.mp3`/`.otf`/`.png` sont **importés** (`import bell from '...mp3'` → URL hashée). Recommandation officielle : « préférer l'import d'assets » plutôt que `public/`, sauf besoin d'URL stable. Les polices passent par `@font-face` (import d'URL ou `public/`).

### 6.2 Choix d'architecture (mes recommandations, **non imposées par Vite**)

| Sujet | Proposition | Alternative |
|---|---|---|
| **Structure** | **Conserver l'arborescence par domaines** existante (excellente base). | — |
| **Styles** | **Tailwind CSS classique** (réutilise `palette.ts` + logique de `tailwind.config.js`). Migration mentale directe depuis NativeWind. | CSS Modules si on veut zéro dépendance de style. |
| **État global** | **Garder le React Context** actuel (`AppDataContext`). Suffisant, déjà en place. | — (pas de Redux/Zustand nécessaire) |
| **Persistance** | **`localStorage`** derrière un adaptateur conservant l'API `storage.ts`. Synchrone comme MMKV. | IndexedDB si volume important (peu probable ici). |
| **Routing / navigation** | Voir **§7 (décision)**. Option A : `react-router`. Option B : routeur maison minimal (l'app n'a que ~9 routes et un conteneur d'onglets). | — |
| **Swipe tabs** | CSS **scroll-snap** horizontal (léger, natif) + réactivation possible de `PageIndicator` en CSS. | Lib dédiée seulement si le scroll-snap ne suffit pas. |
| **Icônes** | **`lucide-react`** (parité directe avec `lucide-react-native`). | — |
| **Graphique** | **SVG DOM maison** (un seul graphe, courbe simple). | `recharts` si on préfère une lib. |
| **Audio** | Hook maison `useSoundPlayer` sur **`HTMLAudioElement`**, préchargement + déverrouillage au 1er tap. | Web Audio API si besoin de contrôle fin (non requis aujourd'hui). |
| **Tests** | **Vitest** (intégration Vite native) + migration du test existant. | Garder Jest (moins naturel avec Vite). |
| **Lint/format** | ESLint (config web) + Prettier conservés. | — |
| **PWA / installable** | **Hors périmètre initial** sauf demande (intéressant pour une app de méditation : offline + icône). | `vite-plugin-pwa` dans un second temps. |

### 6.3 Esquisse d'arborescence cible

```
<app>/
├── index.html                # point d'entrée Vite
├── vite.config.ts            # alias src/*, plugins (react, tailwind)
├── tsconfig.json             # strict, paths
├── tailwind.config.js        # réutilise PALETTE
├── public/                   # favicon, éventuels assets non hashés
└── src/
    ├── main.tsx              # montage React (remplace index.tsx + registerRootComponent)
    ├── App.tsx               # providers + router
    ├── data/                 # storage.ts (adaptateur localStorage) + storage.types.ts (inchangé)
    ├── store/                # AppDataContext (quasi inchangé)
    ├── domains/              # mêmes domaines, composants réécrits en DOM
    ├── assets/               # fonts/.otf, sounds/.mp3 (réutilisés)
    ├── theme/palette.ts      # inchangé
    └── styles/index.css      # @tailwind + @font-face
```

---

## 7. Décisions (validées le 2026-11-03)

| # | Décision | Choix retenu |
|---|---|---|
| 1 | **Parité vs. correction des bugs** | ✅ **Corriger** les anomalies §5.2 pendant la migration. |
| 2 | **Routing** | ✅ **`react-router`**. |
| 3 | **Swipe entre onglets** | ✅ **Préserver** le swipe (scroll-snap horizontal, barre masquée). |
| 4 | **Cible d'appareils** | ✅ **Mobile-first** (portrait). |
| 5 | **Stratégie de dépôt** | ✅ Le **Web remplace** la cible → **nettoyage de la config native** (`ios/`, `android/`, Expo, Metro…). |
| 6 | **PWA/offline + mode sombre** | ⏳ **Plus tard** (hors périmètre initial). |

### Points mineurs restants (recommandations par défaut, à confirmer)

- **Picker de durée** — proposition : sélecteur maison « mobile-first » (roue/heures-minutes) plutôt que `<input type="time">`, pour rester fidèle à l'UX actuelle.
- **Dépendances inutilisées** — `@react-native-community/slider`, `MeditationStats`, `softDeleteMeditationSessions` : à **abandonner** sauf besoin identifié.
- **Migration des données** — supposé : démarrage `localStorage` vierge (projet perso). L'import du JSON exporté reste possible ultérieurement si besoin.

---

## 8. Critères de réussite de la migration

**Fonctionnels (parité)**
- [ ] Les 5 vues (Settings, Activity, Home, Calendar, Pixel Year) sont navigables.
- [ ] Déroulé de séance complet : choix durée → minuteur → recentrages (tap) → pause/reprise → dépassement (`+mm:ss`) → enregistrer/quitter → résumé.
- [ ] Sons de début/fin/recentrage jouables et configurables, avec aperçu dans la modale.
- [ ] Vibrations déclenchées là où le navigateur le permet (dégradation propre sinon).
- [ ] Météo intérieure sélectionnable et persistée ; affichée dans liste, calendrier, pixel year.
- [ ] Graphique des recentrages/minute fonctionnel.
- [ ] Calendrier mensuel (points de séance, navigation) et Pixel Year (navigation année, bornes) corrects.
- [ ] Statistiques d'activité exactes (idéalement métriques corrigées).
- [ ] CRUD citations complet **et persistant** ; citation du jour sur Home.
- [ ] Export des données (téléchargement/partage) et suppression globale.
- [ ] Données persistées entre sessions ; valeurs par défaut au 1er lancement (citations + réglages).

**Techniques**
- [ ] `tsc --noEmit` passe en **mode strict**, zéro erreur.
- [ ] ESLint + Prettier passent.
- [ ] Le test existant (migré sur Vitest) passe ; idéalement nouveaux tests sur les utils corrigés.
- [ ] `vite build` produit un bundle fonctionnel ; `vite preview` servable.
- [ ] Aucune dépendance React Native / Expo résiduelle dans le bundle Web.
- [ ] Temps de démarrage dev (HMR) et taille de bundle raisonnables.

**UX / qualité**
- [ ] Rendu fidèle (polices SF Pro, palette, espacements) sur la cible d'appareils retenue.
- [ ] Minuteur fiable même onglet en arrière-plan (ancrage horloge réelle).
- [ ] Comportement correct au rechargement de page pendant une séance (décision à prendre : reprise ou abandon).
- [ ] Pas de régression de données (schéma de stockage identique, import possible du JSON exporté si retenu).

---

## 9. Conclusion de l'audit

La migration est **faisable et de complexité maîtrisée**. L'application est petite (~3 300 lignes), bien structurée par domaines, **sans backend ni logique réseau**, et une **part importante du code est du JS/TS pur réutilisable** (modèle de données, calculs de métriques, utils dates, constantes, Context).

L'essentiel de l'effort porte sur la **couche de présentation** (primitives RN → DOM, NativeWind → Tailwind CSS) et sur **4 ponts natifs** à réimplémenter : **audio** (expo-av → HTMLAudio), **persistance** (MMKV → localStorage), **navigation + swipe** (react-navigation → routeur Web), et quelques **capacités d'appareil** (vibration, keep-awake, partage) qui se **dégraderont gracieusement** sur le Web — surtout iOS Safari.

Les principaux **points bloquants/arbitrages** avant de démarrer sont réunis au **§7** (parité vs. corrections, routing, swipe, cible desktop/mobile, dégradations natives acceptables, PWA, migration des données).
