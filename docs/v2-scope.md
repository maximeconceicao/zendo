# Périmètre de Zendō v2 (livré)

> Document de référence sur **ce que la v2 Web livre réellement**. Il fait
> autorité sur l'état actuel de l'application, là où
> [`migration-audit.md`](./migration-audit.md) et
> [`migration-plan.md`](./migration-plan.md) décrivent la **planification
> historique** (parité avec l'app mobile, visée à l'origine le 2026-11-03).
>
> La v2 n'est pas une transposition 1:1 de l'app mobile : c'est une réécriture
> Web **resserrée sur le cœur** « méditer + suivre ses séances ». Plusieurs
> fonctionnalités de la version mobile ont été **volontairement laissées de
> côté** (voir §3).

---

## 1. Ce que fait l'application

Journal de méditation Web, **local / hors-ligne / mono-utilisateur** (aucun
backend, compte ni réseau). Installable en PWA.

### Navigation

Trois onglets swipables (CSS scroll-snap, HOME au centre ; rail latéral sur
desktop) :

```
 Réglages  ◄──  [ Accueil ]  ──►  Activités
```

- La **séance** se déroule en place sur l'écran Accueil (pas d'écran dédié).
- L'écran **Jour** s'ouvre par-dessus, au clic sur un jour du ruban d'activité.

### Séance de méditation (Accueil)

- Choix de la durée via un **sélecteur maison** (`DurationPicker`), mémorisé
  (`lastSelectedDurationSeconds`, défaut 20 min).
- **Minuteur** plein écran ancré sur l'horloge réelle (`Date.now()`) : fiable
  même onglet en arrière-plan.
- **Pause / reprise** ; en pause, deux options : **Quitter** (sans enregistrer)
  ou **Enregistrer**.
- À la durée atteinte, le minuteur **se fige à `00:00`** (pas de décompte
  négatif) et propose **« Terminer la session »**.
- **Sons** début/fin configurables (avec aperçu), **vibrations** début/fin
  (no-op si non supporté, ex. iOS Safari), **écran maintenu allumé** pendant la
  séance (Wake Lock, dégradation gracieuse).

### Suivi de l'activité

- **Activités** : ruban continu façon « contributions GitHub » (semaines
  lundi→dimanche, intensité par jour = nombre de séances), sous-titre = total de
  méditations. Clic sur un jour → écran **Jour**.
- **Jour** : liste des séances du jour (date, durée), bouton Retour.

### Réglages & données

- Sons (début/fin) et vibrations (début/fin).
- **Export JSON** (Web Share API si disponible, sinon téléchargement).
- **Suppression** de toutes les séances (avec confirmation).

---

## 2. Modèle de données

```ts
type MeditationSession = {
  id: string;                    // timestamp (voir dette technique)
  date: string;                  // ISO 8601
  plannedDurationSeconds: number;
  actualDurationSeconds: number;
  note?: string;                 // champ présent mais non alimenté par l'UI
  deletedAt?: string;            // soft-delete réservé, non câblé (delete = hard)
};

type UserSettings = {
  soundOnSessionStart, soundTypeOnSessionStart,
  soundOnSessionEnd,   soundTypeOnSessionEnd,
  vibrateOnSessionStart, vibrateOnSessionEnd,
  lastSelectedDurationSeconds,
};
```

Persistance `localStorage`. Valeurs par défaut (réglages) semées au 1er
lancement.

---

## 3. Fonctionnalités de l'app mobile **non reprises** en v2

Ces éléments figurent dans l'inventaire de parité de `migration-audit.md` §2
mais **ne sont pas présents** dans la v2 Web (décision assumée) :

| Fonctionnalité mobile | Statut v2 |
|---|---|
| **Citations** (du jour + CRUD + 5 par défaut) | Retirée (domaine supprimé) |
| **Météo intérieure** (ressenti Stormy→Sunny) | Retirée (plus de champ ni d'UI) |
| **Recentrages / focus points** + compteur animé + graphique | Retirés |
| **Statistiques d'activité détaillées** (séries, moyennes, offset prévu/réalisé, totaux) | Retirées — seul le **compteur de séances** subsiste |
| **Pixel Year** (grille annuelle) | Retiré |
| **Résumé / détail post-séance** | Retirés (la séance enregistre et revient à l'accueil) |
| **Dépassement `+mm:ss`** (décompte négatif après la durée) | Changé : gel à `00:00` |
| 5 onglets (Settings / Activity / Home / Calendar / Pixel Year) | Réduit à **3** |

> Le minuteur (`useSessionTimer`) *supporte* encore un `timeLeft` négatif, mais
> l'écran Accueil le fige à zéro : le dépassement n'est donc pas exposé.

---

## 4. Stack & déploiement

- React 18 + TypeScript strict, Vite, Tailwind CSS, lucide-react.
- react-router (3 onglets scroll-snap + rail desktop + écran Jour).
- État : React Context (`AppDataContext`, `MeditationActiveContext`).
- PWA (`vite-plugin-pwa`) : installable, hors-ligne, prompt de MAJ non intrusif.
- Tests : Vitest (couche pure : storage, utils calendrier, composants `ui`).
- Déploiement : GitHub Pages (base `/zendo/`), workflow `deploy.yml` sur `main`.

---

## 5. Dette technique connue (non bloquante, à suivre)

- IDs de session = `Date.now().toString()` (le plan prévoyait
  `crypto.randomUUID()`) : risque de collision théorique.
- Écritures `localStorage` sans `try/catch` (quota / Safari navigation privée).
- Lecture `storage` sans validation de forme (cast direct) : fragile face à des
  données héritées/corrompues.
- Updates optimistes sans rollback en cas d'échec d'écriture.
- Synchronisation scroll↔URL des onglets : fenêtre de suppression de 700 ms
  pouvant désynchroniser l'URL (voir `MainTabs.tsx`).
- Code mort résiduel (`date.utils`: `generateCalendar`, `getCurrentMonthTitle`),
  `note` / `deletedAt` non utilisés.
- Polices `.otf` ~2,3 Mo chacune précachées par le SW (envisager un subset
  `woff2`) ; vérifier la licence des polices SF Pro embarquées.

La suite responsive/design-system est planifiée dans
[`web-refactor-plan.md`](./web-refactor-plan.md).
