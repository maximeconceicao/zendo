export type MeditationSession = {
  id: string; // UUID ou timestamp
  date: string; // Format ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
  duration: number; // Durée en secondes
  focusPoints: { timestamp: number }[]; // Liste des moments où l'attention a été recentrée (en secondes)
};

export type UserSettings = {
  theme: 'light' | 'dark';
  endSound: string;
  volume: number;
  vibration: boolean;
};

export type MeditationStats = {
  totalMinutes: number;
  lastSession: string;
};

export interface StorageSchema {
  userSettings: UserSettings;
  authToken: string | null;
  meditationStats: MeditationStats;
  meditationSessions: MeditationSession[];
}
