export type MeditationSession = {
  id: string; // UUID ou timestamp
  date: string; // Format ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
  planneDurationSeconds: number; // Duration in seconds
  actualDurationSeconds: number;
  focusPoints: FocusPoint[]; //List of moments when attention was refocused (in seconds)
};

export type FocusPoint = {
  elapsedTime: number;
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
