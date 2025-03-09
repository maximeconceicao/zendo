import { MMKV } from 'react-native-mmkv';
import { StorageSchema, MeditationSession, UserSettings } from 'src/types/storage.types';

export const storage = new MMKV();

export function setItem<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]) {
  storage.set(key, JSON.stringify(value));
}

export function getItem<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : null;
}

/*
 * Meditation sessions
 */

export const getMeditationSessions = (): MeditationSession[] | null => {
  return getItem('meditationSessions');
};

export const saveMeditationSession = (session: MeditationSession) => {
  const sessions = getItem('meditationSessions');

  if (!sessions) {
    setItem('meditationSessions', [session]);
    return;
  }

  sessions.push(session);
  setItem('meditationSessions', sessions);
};

/*
 * User Settings
 */

export const getUserSettings = (): UserSettings | null => {
  return getItem('userSettings');
};

export const saveUserSettings = (settings: Partial<UserSettings>) => {
  const currentSettings = getUserSettings();
  if (!currentSettings) {
    setItem('userSettings', settings);
    return;
  }
  setItem('userSettings', { ...currentSettings, ...settings });
};
