export type MeditationSession = {
  id: string; // UUID ou timestamp
  date: string; // Format ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
  plannedDurationSeconds: number; // Duration in seconds
  actualDurationSeconds: number;
  focusPoints: FocusPoint[]; //List of moments when attention was refocused (in seconds)
};

export type FocusPoint = {
  elapsedTime: number;
};

export type UserSettings = {
  volume?: number;
  vibrateOnSessionStart?: boolean;
  vibrateOnSessionEnd?: boolean;
  vibrateOnFocus?: boolean;
};

export type MeditationStats = {
  totalMinutes: number;
  lastSession: string;
};

export type MeditationQuote = {
  quote: string;
  author: string;
  book?: string;
};

export interface StorageSchema {
  userSettings: UserSettings;
  meditationStats: MeditationStats;
  meditationSessions: MeditationSession[];
  meditationQuotes: MeditationQuote[];
}
