import { MMKV } from 'react-native-mmkv';
import { StorageSchema, MeditationSession } from 'src/types/storage.types';

export const storage = new MMKV();

export function setItem<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]) {
  storage.set(key, JSON.stringify(value));
}

export function getItem<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : null;
}

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
