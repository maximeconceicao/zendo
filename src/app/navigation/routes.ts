// Chemins centralisés (remplacent les ScreenName de react-navigation).
export const ROUTES = {
  home: '/home',
  settings: '/settings',
  activity: '/activity',
  day: '/day'
} as const;

// Données passées entre écrans via l'état de navigation react-router (location.state).
export type DayRouteState = { date: string }; // clé de jour yyyy-MM-dd
