import { SoundType } from 'src/domains/shared/constants/common.constants';

export type MeditationSession = {
  id: string; // UUID ou timestamp
  date: string; // Format ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ
  plannedDurationSeconds: number; // Duration in seconds
  actualDurationSeconds: number;
  note?: string;
  deletedAt?: string;
};

export type UserSettings = {
  soundOnSessionStart: boolean;
  soundTypeOnSessionStart: SoundType;
  soundOnSessionEnd: boolean;
  soundTypeOnSessionEnd: SoundType;
  vibrateOnSessionStart: boolean;
  vibrateOnSessionEnd: boolean;
  lastSelectedDurationSeconds: number;
};

export interface StorageSchema {
  hasBeenLaunched: boolean;
  userSettings: UserSettings;
  meditationSessions: MeditationSession[];
}
