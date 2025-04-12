import { MeditationFeeling } from 'src/constants/session.constants';

export type MeditationSession = {
  id: string; // UUID ou timestamp
  date: string; // Format ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
  plannedDurationSeconds: number; // Duration in seconds
  actualDurationSeconds: number;
  focusPoints: FocusPoint[]; //List of moments when attention was refocused (in seconds)
  feeling: MeditationFeeling;
  note?: string;
  deletedAt?: string;
};

export type FocusPoint = {
  elapsedTime: number;
};

export type UserSettings = {
  volume?: number;
  vibrateOnSessionStart?: boolean;
  vibrateOnSessionEnd?: boolean;
  vibrateOnFocus?: boolean;
  showQuotes?: boolean;
  lastSelectedDurationSeconds?: number;
};

export type MeditationStats = {
  totalMinutes: number;
  lastSession: string;
};

export type MeditationQuote = {
  id: string;
  text: string;
  author: string;
  book?: string;
};

export type MeditationQuoteUpsert = Omit<MeditationQuote, 'id'> &
  Partial<Pick<MeditationQuote, 'id'>>;

export interface StorageSchema {
  hasBeenLaunched: boolean;
  userSettings: UserSettings;
  meditationStats: MeditationStats;
  meditationSessions: MeditationSession[];
  meditationQuotes: MeditationQuote[];
}
