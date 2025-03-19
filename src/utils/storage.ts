import { MMKV } from 'react-native-mmkv';
import { StorageSchema, MeditationSession, UserSettings } from 'src/types/storage.types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';

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

export const updateMeditationSession = (updatedSession: MeditationSession) => {
  const sessions = getItem('meditationSessions');
  if (!sessions) return;

  const updatedSessions = sessions.map((session) =>
    session.id === updatedSession.id ? { ...session, ...updatedSession } : session
  );

  setItem('meditationSessions', updatedSessions);
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

export const deleteMeditationSession = (id: string) => {
  const sessions = getMeditationSessions();
  if (!sessions) return;

  const updatedSessions = sessions.filter((session) => session.id !== id);

  setItem('meditationSessions', updatedSessions);
};

export const exportMeditationSessions = async () => {
  try {
    const todayDate = format(new Date(), 'yyyy_MM_dd');
    const fileName = `meditation_data_${todayDate}.json`;

    // 1. Get sessions
    const sessions = getMeditationSessions();

    // 2. Convert to JSON
    const jsonString = JSON.stringify(sessions, null, 2);

    // 3. Determine the file path
    const fileUri = FileSystem.documentDirectory + fileName;

    // 4. Write the JSON string to the file
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8
    });

    // 5. Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      console.log('Le partage n’est pas disponible sur cet appareil.');
    }
  } catch (error) {
    console.error('Erreur lors de l’export des données :', error);
  }
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
