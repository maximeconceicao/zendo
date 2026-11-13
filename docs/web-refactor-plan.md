# Plan de refonte « web-native » — Zendō

> Suite de [`migration-plan.md`](./migration-plan.md). La migration RN → React/Vite est **terminée et fonctionnelle**. Ce document planifie une **seconde passe** : faire évoluer le code d'une transposition 1:1 de React Native vers une **vraie application web responsive**, alignée sur les standards DOM et les bonnes pratiques React.
>
> **Ce document est un plan. Aucune implémentation n'a démarré.**
> Branche : `feat/web-migration` · Date : 2026-11-12
>
> **Décisions validées** : cible = **application responsive complète** (mobile → desktop, suppression du cadre 480px figé) · livraison **vague par vague**, chaque vague laissant l'app fonctionnelle (lint + tests verts).

---

## 1. Constat : ce qui est resté « mobile »

La migration a porté le code RN tel quel sur le DOM. L'app tourne, mais elle « pense » encore comme React Native :

| # | Symptôme | Localisation | Nb |
|---|----------|--------------|-----|
| 1 | Primitives RN ré-émulées (`View`, `Pressable`) + reset CSS `[data-rnview]` imposant le box-model RN (flex colonne, `shrink:0`, `align:stretch`) | [`primitives.tsx`](../src/domains/shared/components/primitives.tsx), [`index.css`](../src/styles/index.css) | 14 fichiers importent les primitives |
| 2 | `<View>` / `<Pressable>` au lieu de `<div>`/`<section>`/`<button>` | partout | 55 `<View>`, 18 `<Pressable>` |
| 3 | `onPress` au lieu de `onClick` | partout | 21 |
| 4 | `flex-row`/`flex-col`/`items-stretch` écrits pour contrer le défaut RN | partout | 21 |
| 5 | `CustomText` = `<span>` générique, aucune sémantique (`h1`/`p`/`label`) | [`CustomText.tsx`](../src/domains/shared/components/CustomText.tsx) | 39 usages |
| 6 | `Switch` imite l'API RN (`value`/`onValueChange`/`trackColor`/`thumbColor`) au lieu d'un `<input type="checkbox">` | [`Switch.tsx`](../src/domains/shared/components/Switch.tsx) | 6 |
| 7 | Styles `style={{}}` inline avec couleurs en dur (`rgba(0,0,0,0.9)`, `#6B7280`…) mêlés à Tailwind | 8 fichiers | — |
| 8 | Palette dupliquée manuellement entre TS et config Tailwind | [`palette.ts`](../src/theme/palette.ts) ↔ [`tailwind.config.js`](../tailwind.config.js) | — |
| 9 | Navigation = onglets *swipables* (scroll-snap + sync URL manuelle), aucune nav par liens | [`MainTabs.tsx`](../src/app/navigation/MainTabs.tsx) (~180 l.), [`TabIndicator.tsx`](../src/app/navigation/TabIndicator.tsx) | — |
| 10 | Paradigmes mobiles : `max-width:480px` figé, `env(safe-area-inset)`, pas de layout desktop | [`index.css`](../src/styles/index.css), [`ScreenLayout.tsx`](../src/domains/shared/layouts/ScreenLayout.tsx) | — |
| 11 | Pas de design-system : bouton noir arrondi réécrit inline 6+ fois | `HomeScreen`, `DurationPicker`, `CustomAlert`… | — |
| 12 | Sémantique/a11y faibles : pas de `<main>`/`<nav>`/`<header>`, pas de `<ul>` pour les listes | partout | — |

**Ce qui est déjà bon** (à conserver) : organisation en domaines, hooks web propres ([`useKeepAwake`](../src/domains/shared/hooks/useKeepAwake.ts) via Wake Lock API, [`vibrate`](../src/domains/shared/utils/device.utils.ts) via Vibration API), store par Context, routing `react-router`, TypeScript strict, tests sur la couche pure.

---

## 2. Principes de la refonte

1. **Vague par vague**, chaque vague se termine sur `npm run lint` + `npm run test` verts et une app utilisable.
2. **Du socle vers l'UI** : tokens → composants → écrans → navigation → responsive. On ne touche à la navigation (le plus risqué) qu'une fois les briques saines.
3. **Zéro régression visuelle non-voulue** : à apparence égale tant qu'on n'attaque pas la vague responsive ; on compare l'écran avant/après.
4. **HTML sémantique par défaut** : un conteneur est un `<div>`/`<section>`, un titre un `<h1>`, une liste un `<ul>`, un bouton un `<button>`. Flexbox s'active explicitement (`flex`), on ne le subit plus.
5. **Pas de sur-ingénierie** : pas de lib de composants externe, pas de CSS-in-JS. Tailwind + quelques composants maison suffisent.

---

## 3. Structure cible

```
src/domains/shared/
├── components/
│   ├── ui/                    # ← nouveau : design-system
│   │   ├── Button.tsx         # remplace les boutons inline + Pressable "bouton"
│   │   ├── Text.tsx           # Text/Heading sémantiques (remplace CustomText)
│   │   ├── Switch.tsx         # <input type=checkbox> stylé (API web)
│   │   └── Modal.tsx          # <dialog> ou portal a11y (déplacé depuis primitives)
│   ├── ConfirmationModal.tsx
│   ├── CustomAlert.tsx
│   └── HorizontalLine.tsx     # → <hr> (ou supprimé)
│   └── (primitives.tsx SUPPRIMÉ en fin de vague 3)
├── layouts/
│   └── ScreenLayout.tsx       # <header> + <main>, responsive
└── ...
src/app/navigation/
├── AppNav.tsx                 # nav par <Link>, responsive (remplace MainTabs)
└── (MainTabs.tsx / TabIndicator.tsx retravaillés ou supprimés)
```

---

## 4. Détail des vagues

### Vague 0 — Baseline anti-régression (préalable obligatoire)

Les vagues 1-3 promettent « iso-visuel », mais le repo n'a **aucun test visuel/snapshot** (tests uniquement sur la couche pure). L'œil seul ne détectera pas les régressions diffuses du retrait de `[data-rnview]` (cf. vague 3). Avant de toucher au code :

- Lancer l'app et **capturer une baseline** des états clés, à au moins deux largeurs (≈375px et desktop) :
  - les 3 écrans (Accueil, Réglages, Calendrier) + `DayScreen` ;
  - le flow de séance complet : accueil → en cours → pause → terminé → `DurationPicker` → `CustomAlert`/`ConfirmationModal`/`SoundSelectModal`.
- Comparer les captures après **chaque** vague 1-3. C'est l'oracle qui rend crédible le « iso-visuel ».

---

### Vague 1 — Fondations : tokens & couleurs (risque nul)

**Objectif** : une seule source de vérité pour les couleurs, zéro couleur magique dans le JSX.

- **Dé-dupliquer la palette.** Deux options :
  - (a) `palette.ts` reste la source → `tailwind.config.js` l'importe (passer la config Tailwind en ESM/TS, ou générer un JSON). 
  - (b) `tailwind.config.js` devient la source unique → on supprime `palette.ts` et on lit les tokens via classes. **Recommandé** (b) : plus simple, les couleurs vivent là où elles sont consommées.
- **Introduire des tokens Tailwind** pour les couleurs récurrentes aujourd'hui en dur :
  - `rgba(0,0,0,0.9)` → `ink` (noir de marque) → `bg-ink` / `text-ink`
  - `rgba(0,0,0,0.055)` / `0.08` / `0.12` → `ink/5`, `ink/10` via opacité Tailwind
  - `#6B7280`, `#111827`, `gray-*` → conserver l'échelle `gray` Tailwind
- **Couleurs d'icônes en dur** : `<Hourglass color="black">`, `color="#6B7280"`, `color="#9CA3AF"` (4 sites : `HomeScreen`, `MeditationList`). Passer à `color="currentColor"` (défaut lucide) pour **hériter de la couleur de texte** du parent — idiome web, supprime le couplage couleur en dur ↔ icône.
- **Livrable** : `tailwind.config.js` enrichi, `palette.ts` supprimé (ou réduit), aucun changement visuel.

**Fichiers** : `tailwind.config.js`, `palette.ts`, `ScreenLayout.tsx` (seul usage de `PALETTE`), `HomeScreen.tsx`, `MeditationList.tsx` (icônes).

---

### Vague 2 — Design-system : composants web

**Objectif** : créer les briques réutilisables qui remplaceront les primitives, **sans encore migrer tous les écrans**.

**2.1 `Button`** — remplace les 6+ boutons stylés inline.
```tsx
// Avant (HomeScreen, répété partout)
<Pressable className="p-4 rounded-full" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }} onPress={startMeditation}>
  <CustomText className="text-white text-center text-lg">Démarrer la méditation</CustomText>
</Pressable>

// Après
<Button variant="primary" size="lg" onClick={startMeditation}>Démarrer la méditation</Button>
```
Variants : `primary` (noir plein), `ghost` (bordure `ink/10`), `danger` (texte rouge). Rendu : `<button>` natif, `type="button"` par défaut, `disabled`, focus visible.

**2.2 `Text` / `Heading`** — remplace `CustomText` par des éléments sémantiques.
```tsx
<Heading level={1}>Zendō</Heading>        // <h1>
<Text as="p">Personnalisez…</Text>        // <p>
<Text weight="semibold">Session</Text>    // <span> gras
```
Garde la logique police SF (`font-sfLight`/`font-sfSemibold`).

**2.3 `Switch`** — passe à `<input type="checkbox">` visuellement stylé (peer Tailwind), API web `checked`/`onChange` (+ `aria` déjà correct). Apparence conservée.

**Livrable** : composants `ui/` + tests de rendu basiques. Les écrans ne sont pas encore migrés → cette vague n'altère rien de visible.

**Fichiers** : nouveaux `src/domains/shared/components/ui/{Button,Text,Switch}.tsx`.

---

### Vague 3 — Suppression des primitives RN (cœur de la refonte)

**Objectif** : éradiquer `View`/`Pressable`/`onPress` et le reset `[data-rnview]`. Migration **fichier par fichier** pour rester vert en continu.

> ⚠️ **Règle centrale — à ne pas inverser.** Le reset `[data-rnview]` donne à **chaque** `View` un `display:flex; flex-direction:column`. Beaucoup de composants exploitent ce flex **implicite** : ils utilisent `justify-*` / `items-*` / `flex-1` **sans jamais déclarer `flex`**. Converti bêtement en `<div>` (flux **bloc**), ces classes deviennent des **no-op silencieux** → centrage cassé, scrollers qui ne remplissent plus.
>
> La migration ne consiste donc **pas** à « retirer `flex-col` » : elle consiste à **rendre le flex explicite** (`flex flex-col`) partout où le `View` en dépendait. Sites concernés recensés (12, ≈29 classes) : `HomeScreen:128`, `ScreenLayout:28/34/40`, `ConfirmationModal:13/21`, `SoundSelectModal:34/53`, `MeditatingFace:99`, `CalendarScreen:46`, `DayScreen:39`, `SettingsScreen:13`. Règle de décision par `View` :
> - a des enfants à aligner/centrer ou à répartir (`items-*`, `justify-*`), ou contient un enfant `flex-1` → `<div className="flex flex-col …">` (ou `flex-row` si déjà présent) ;
> - est juste un empilement de blocs sans alignement → `<div>` simple (le flux bloc empile déjà verticalement) ; vérifier qu'aucun `gap-*` n'y est posé (le `gap` n'agit que sur flex/grid).

Correspondances :
| RN-isme | Remplacement web |
|---------|------------------|
| `<View className="flex-row …">` | `<div className="flex …">` (ou `<section>`/`<ul>` selon le sens) |
| `<View>` dépendant du flex implicite (`items-*`/`justify-*`/enfant `flex-1`) | `<div className="flex flex-col …">` — **on rend le flex explicite** |
| `<View>` simple empilement de blocs | `<div>` (flux bloc natif) |
| `<Pressable onPress>` | `<Button onClick>` ou `<button onClick>` |
| `<CustomText>` | `<Text>` / `<Heading>` |
| `flex-1` (remplir le parent flex) | conservé **uniquement si le parent reste `flex`** ; sinon le parent doit (re)devenir `flex`, ou passer en `h-full`/`grow` |

Points d'attention lors du retrait de `[data-rnview]` :
- Les `<View className="flex-1">` qui servaient de **scrollers** reposaient sur `flex` implicite + `min-height:0`. Après migration, le parent doit rester `flex` et l'enfant garder `min-h-0` pour que `overflow-y-auto` fonctionne. Vérifier le scroll vertical de chaque écran après coup (Settings, Calendar, Day).
- `CustomAlert` / `DurationPicker` utilisent `onClick` sur des `View` (overlay + `stopPropagation`) : à transposer en `<div onClick>` propres.
- `Modal` déménage de `primitives.tsx` vers `ui/Modal.tsx`. **Reco : conserver le portal** actuel en lui ajoutant un focus-trap et le verrou de scroll `body`, plutôt que `<dialog>` natif. Raison : le pattern actuel (overlay + fermeture au **clic hors-contenu** via `onClick`+`stopPropagation`) n'est pas un drop-in sur `<dialog>` (`showModal()`, `::backdrop`, gestion du clic-extérieur diffèrent) → plus de surprises pour un gain faible.
- `HorizontalLine` → `<hr>` : penser à **réinitialiser le style par défaut** du navigateur (marges, bordure) ; conserver `border-t border-gray-300`.

**Ordre de migration suggéré** (du plus simple au plus central) :
`HorizontalLine` → `TabIndicator` → `CustomAlert` / `ConfirmationModal` → `Settings` / `SettingsScreen` → `SoundSelectModal` → `DurationPicker` → `MeditationList` → `DayScreen` / `CalendarScreen` / `MonthActivityGrid` → `MeditatingFace` → `HomeScreen` → `ScreenLayout`.

**Fin de vague** : supprimer `primitives.tsx`, la règle `[data-rnview]` et `:where(button[data-rnpressable])` de `index.css`. Un `grep -r "primitives\|onPress\|data-rnview"` doit ne rien renvoyer.

---

### Vague 4 — Navigation & layout web

**Objectif** : remplacer la navigation « swipe mobile » par une navigation web first-class, responsive.

- **`ScreenLayout`** → structure sémantique : `<main>` pour le contenu, `<header>` pour le titre. Retirer le `backgroundColor` inline (classe Tailwind) et les `safe-area-inset` (réintroduits seulement en mode mobile via media query si besoin PWA plus tard).
- **Navigation responsive** (remplace `MainTabs`/`TabIndicator`) :
  - **Desktop** : barre ou rail de navigation permanent avec `<nav>` + `<Link>` (Réglages / Accueil / Calendrier) — navigation par clic, URL réelle, focus clavier.
  - **Mobile** : barre de navigation basse (type pill actuel) en `<nav>` avec `<NavLink>`, état actif via `aria-current`.
  - Le **swipe** entre onglets devient une amélioration *progressive* réservée au tactile/mobile (optionnel), plus le mécanisme principal. Le montage permanent des 3 onglets (`MainTabs`) peut être remplacé par du routing classique (`<Routes>`) — à trancher selon le besoin de préserver l'état/scroll de chaque onglet.

**Exigences fonctionnelles à ne pas perdre** (seule vague à comportement modifié) :
- **Verrou de navigation pendant une séance.** `MeditationActiveContext` n'existe aujourd'hui **que** pour que `MainTabs` bloque le swipe et masque l'indicateur pendant la méditation. Avec le routing classique, ce verrou (empêcher de **quitter** l'écran en pleine séance, pas seulement masquer la nav) doit être **réimplémenté explicitement** : désactiver/masquer les `<NavLink>` et, si besoin, bloquer la navigation (garde de route) tant que `isMeditating`.
- **État préservé entre onglets.** Le montage permanent conserve aujourd'hui scroll + état de chaque onglet ; le routing classique les démonte. Décider explicitement ce qui doit survivre : séance en cours → déjà porté par le contexte (OK) ; scroll calendrier → perte acceptable. Documenter le choix.

**Tests (convention équipe : tout changement de comportement = au moins un test)** : deep-links (`/settings`, `/activity`), bouton retour navigateur, et verrou de navigation pendant `isMeditating`.

**Décision à prendre en début de vague** : garder les 3 onglets montés en permanence (état préservé, transitions) vs routing classique (plus simple, plus web). Recommandation : routing classique + conservation d'état via le store si nécessaire.

**Fichiers** : `MainTabs.tsx`, `TabIndicator.tsx`, `ScreenLayout.tsx`, `router.tsx`, `App.tsx`, `store/MeditationActiveContext.tsx`.

---

### Vague 5 — Responsive, sémantique & a11y

**Objectif** : l'app s'adapte réellement de 360px à desktop.

- **Retirer `#root { max-width:480px }`** figé → conteneur de contenu fluide avec `max-width` lisible (ex. `max-w-prose`/`max-w-2xl`) centré, et vrais breakpoints `sm:`/`md:`/`lg:`.
- **Layout desktop** : la nav latérale/haute + contenu centré ; les écrans (Calendar, Settings) exploitent la largeur (grilles multi-colonnes).
- **Sémantique** : listes (`MeditationList`, sons, durées) en `<ul>/<li>` ; `HorizontalLine` → `<hr>`.
- **A11y** : landmarks (`main`/`nav`/`header`), `label` associés aux `Switch`, focus visible homogène, navigation clavier complète, contrastes vérifiés.
- **Nettoyage mobile** : `safe-area-inset` conditionné (ou retiré), `overscroll-behavior` conservé, revoir `touch-action`.

**Fichiers** : `index.css`, `ScreenLayout.tsx`, écrans, composants de liste.

---

## 5. Récapitulatif par fichier

| Fichier | Vague(s) | Action |
|---------|----------|--------|
| `tailwind.config.js`, `theme/palette.ts` | 1 | Source unique de tokens |
| `components/ui/Button.tsx` | 2 | **Créer** |
| `components/ui/Text.tsx` | 2 | **Créer** (remplace `CustomText`) |
| `components/ui/Switch.tsx` | 2 | Réécrire sur `<input checkbox>` |
| `components/ui/Modal.tsx` | 2-3 | Extraire de `primitives`, `<dialog>`/portal a11y |
| `components/primitives.tsx` | 3 | **Supprimer** |
| `components/CustomText.tsx` | 3 | **Supprimer** (→ `Text`) |
| `styles/index.css` | 1,3,5 | Tokens, retrait `[data-rnview]`, responsive |
| Tous les écrans/composants (14) | 3 | `View`/`Pressable`/`onPress`/`CustomText` → DOM/ui |
| `navigation/MainTabs.tsx`, `TabIndicator.tsx` | 4 | Nav web responsive |
| `layouts/ScreenLayout.tsx` | 3,4,5 | Sémantique + responsive |

---

## 6. Risques & vérifications

- **Scroll vertical** : le retrait de `[data-rnview]` (`min-height:0`) peut casser le défilement interne des écrans longs → vérifier Settings / Calendar / Day à chaque fichier migré.
- **Overlays de modales** : `onClick` overlay + `stopPropagation` contenu à ne pas perdre.
- **Animations HomeScreen** : la chorégraphie d'opacité (accueil ↔ séance) dépend du positionnement `absolute`/flux ; migrer `HomeScreen` en dernier et comparer visuellement.
- **Navigation** : la sync URL ↔ scroll est subtile ; valider deep-links (`/settings`, `/activity`) et bouton retour navigateur.
- **Garde-fou** : à chaque fin de vague, `npm run lint` + `npm run test`, et revue visuelle des 3 écrans.

---

## 7. Ordre d'exécution

0. **Vague 0** — baseline de captures d'écran (oracle anti-régression)
1. **Vague 1** — tokens + icônes `currentColor` (préparation, invisible)
2. **Vague 2** — design-system (invisible)
3. **Vague 3** — migration primitives → DOM, **flex rendu explicite** (gros volume, invisible à apparence égale)
4. **Vague 4** — navigation web (verrou séance + tests)
5. **Vague 5** — responsive & a11y (le visible desktop arrive ici)

Les vagues 1-3 sont des refactos « iso-visuel » à faible risque produit (validés contre la baseline V0) ; le changement d'expérience (desktop) est concentré en 4-5.

---

## 8. Journal d'implémentation (réalisé)

Les 5 vagues ont été implémentées sur `feat/web-migration`. État final : `lint`, `tsc`, 17 tests Vitest et `vite build` verts. Diff net ≈ −160 lignes.

**Vague 1** — `tailwind.config.js` devient la source unique (token `ink`, `palette.ts` supprimé) ; icônes lucide passées en `currentColor` via `className` (gray-500/gray-400/black, iso-visuel).

**Vague 2** — design-system sous `src/domains/shared/components/ui/` : `Button` (variants `primary`/`outline`/`subtle`), `Text`/`Heading` (éléments sémantiques), `Switch` (`<input type=checkbox>` + `peer`), `Modal` (portal + focus-trap + scroll-lock + restauration focus). Tests de rendu dans `ui/ui.spec.tsx`.

**Vague 3** — tous les `View`/`Pressable`/`onPress`/`CustomText` supprimés ; règle : chaque `View` → `<div className="flex flex-col|flex-row …">` (flex rendu explicite). `primitives.tsx`, `CustomText.tsx` supprimés, règles CSS `[data-rnview]`/`data-rnpressable` remplacées par un reset `:where(button)`. Styles inline `rgba()` → tokens (`bg-ink/90`, `border-ink/[0.12]`…).

**Vague 4** — navigation : **swipe conservé** (décision produit) ; ajout d'un `NavRail` (rail latéral gauche `md:`), `TabIndicator` (pastille) réservé au mobile (`md:hidden`). Verrou séance : `isMeditating` masque rail + pastille + swipe. Test `NavRail.spec.tsx`.

**Vague 5** — `#root` passe pleine largeur (retrait `max-width:480px`) ; `ScreenLayout` : colonne de contenu centrée `max-w-xl` sur desktop + landmarks (`<section aria-label>`, `<header>`, `<Heading level={1}>`).

### Écarts assumés vs plan initial
- **`ConfirmationModal.tsx` supprimé** (code mort, aucun importateur) plutôt que migré.
- **Navigation par swipe conservée** (le plan recommandait le routing classique ; le produit a tranché pour garder le geste + ajouter le rail desktop).
- **`HorizontalLine` → `<hr>`** avec reset (`m-0 border-0 border-t`).
- **Baseline visuelle (V0)** non capturée automatiquement : validation faite via `lint`/`tsc`/tests/build + revue de diff + serveur de dev. À confirmer visuellement côté produit.
