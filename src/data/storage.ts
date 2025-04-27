import { MMKV } from 'react-native-mmkv';
import {
  StorageSchema,
  MeditationSession,
  UserSettings,
  MeditationQuote,
  MeditationQuoteUpsert
} from 'src/data/storage.types';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_SESSION_DURATION_SECONDS } from 'src/domains/meditation/constants/session.constants';
import { FocusSoundType, SoundType } from 'src/domains/shared/constants/common.constants';

const defaultMeditationQuotes: MeditationQuote[] = [
  {
    id: uuidv4(),
    text: "La pratique de la méditation n'a pas pour but de nous rejeter nous-même et de devenir meilleur. Son objet est de nous lier d'amitié avec la personne que nous sommes déjà.",
    author: 'Pema Chödrön',
    book: 'Entrer en amitié avec soi-même',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    text: "Rien n'est plus important pour votre propre croissance personnelle que de prendre conscience que vous n'êtes pas la voix qui parle dans votre tête - vous êtes celui qui l'entend.",
    author: 'Michael A. Singer',
    book: "L'âme délivrée",
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    text: "Ce n'est donc pas seulement la pratique assise qui importe mais, bien plus, l'état d'esprit dans lequel vous vous trouvez après la méditation. C'est cet état d'esprit calme et centré qu'il vous faut prolonger dans chacune de vos actions.",
    author: 'Sogyal Rinpoché',
    book: 'Le Livre tibétain de la vie et de la mort',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    text: "Demeurez en vous-mêmes comme une île, comme un refuge. Ne cherchez pas d'autre refuge que vous-mêmes.",
    author: 'Bouddha',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    text: "Le sens de la vie, c'est simplement d'être en vie. C'est si clair, si évident, si simple. Et pourtant, tout le monde court dans tous les sens, pris de panique, comme s'il fallait absolument atteindre quelque chose au-delà de soi.",
    author: 'Alan Watts',
    createdAt: new Date().toISOString()
  }
];

export const defaultUserSettings: UserSettings = {
  vibrateOnFocus: true,
  soundOnSessionStart: false,
  soundTypeOnSessionStart: SoundType.BELL_BOWL,
  soundOnSessionEnd: false,
  soundTypeOnSessionEnd: SoundType.BELL_BOWL,
  soundOnFocus: false,
  soundTypeOnFocus: FocusSoundType.TOMTOM,
  vibrateOnSessionStart: true,
  vibrateOnSessionEnd: true,
  showQuotes: true,
  lastSelectedDurationSeconds: DEFAULT_SESSION_DURATION_SECONDS
};

export const storage = new MMKV();

export function setItem<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]) {
  storage.set(key, JSON.stringify(value));
}

export function getItem<K extends keyof StorageSchema>(key: K): StorageSchema[K] | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : null;
}

export const initStorageIfFirstLaunch = () => {
  const hasBeenLaunched = storage.getBoolean('hasBeenLaunched');
  if (!hasBeenLaunched) {
    setItem('meditationQuotes', defaultMeditationQuotes);
    setItem('userSettings', defaultUserSettings);

    storage.set('hasBeenLaunched', true);
  }
};

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
 * Meditation quotes
 */

export const getMeditationQuotes = (): MeditationQuote[] | null => {
  return (
    getItem('meditationQuotes')?.sort((a, b) => a.createdAt.localeCompare(b.createdAt)) || null
  );
};

export const upsertMeditationQuote = (quote: MeditationQuoteUpsert) => {
  const existingQuotes = getItem('meditationQuotes') || [];

  const quoteExists = existingQuotes.some((q) => q.id === quote.id);
  const updatedQuotes = quoteExists
    ? existingQuotes.map((q) => (q.id === quote.id ? { ...q, ...quote } : q))
    : [...existingQuotes, { ...quote, id: uuidv4(), createdAt: new Date().toISOString() }];

  setItem('meditationQuotes', updatedQuotes);
};

/*
 * User Settings
 */

export const getUserSettings = (): UserSettings => {
  const raw = getItem('userSettings');
  return {
    ...defaultUserSettings,
    ...raw
  };
};

export const saveUserSettings = (settings: Partial<UserSettings>) => {
  const currentSettings = getUserSettings();
  setItem('userSettings', { ...currentSettings, ...settings });
};
