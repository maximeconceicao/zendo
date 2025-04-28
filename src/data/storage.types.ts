import { InnerWeather } from 'src/domains/meditation/constants/inner-weather.constants';
import { FocusSoundType, SoundType } from 'src/domains/shared/constants/common.constants';

export type MeditationSession = {
  id: string; // UUID ou timestamp
  date: string; // Format ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
  plannedDurationSeconds: number; // Duration in seconds
  actualDurationSeconds: number;
  focusPoints: FocusPoint[]; //List of moments when attention was refocused (in seconds)
  innerWeather: InnerWeather;
  note?: string;
  deletedAt?: string;
};

export type FocusPoint = {
  elapsedTime: number;
};

export type UserSettings = {
  soundOnSessionStart: boolean;
  soundTypeOnSessionStart: SoundType;
  soundOnSessionEnd: boolean;
  soundTypeOnSessionEnd: SoundType;
  soundOnFocus: boolean;
  soundTypeOnFocus: FocusSoundType;
  vibrateOnSessionStart: boolean;
  vibrateOnSessionEnd: boolean;
  vibrateOnFocus: boolean;
  showQuotes: boolean;
  lastSelectedDurationSeconds: number;
};

export type MeditationStats = {
  totalMinutes: number;
  lastSession: string;
};

export type MeditationQuote = {
  id: string;
  text: string;
  author?: string;
  book?: string;
  createdAt: string;
};

export type MeditationQuoteUpsert = Omit<MeditationQuote, 'id' | 'createdAt'> &
  Partial<Pick<MeditationQuote, 'id' | 'createdAt'>>;

export interface StorageSchema {
  hasBeenLaunched: boolean;
  userSettings: UserSettings;
  meditationStats: MeditationStats;
  meditationSessions: MeditationSession[];
  meditationQuotes: MeditationQuote[];
}
