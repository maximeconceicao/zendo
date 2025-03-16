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
  const sessions = getItem('meditationSessions');
  return sessions?.filter((session) => !session.deletedAt) || null;
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

export const softDeleteMeditationSessions = () => {
  const sessions = getMeditationSessions();
  if (!sessions) return;

  const updatedSessions = sessions.map((session) => ({
    ...session,
    deletedAt: new Date().toISOString()
  }));

  setItem('meditationSessions', updatedSessions);
};

export const deleteMeditationSessions = () => {
  setItem('meditationSessions', []);
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
