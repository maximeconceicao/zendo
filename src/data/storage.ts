import { StorageSchema, MeditationSession, UserSettings } from 'src/data/storage.types';
import { format } from 'date-fns';
import { DEFAULT_SESSION_DURATION_SECONDS } from 'src/domains/meditation/constants/session.constants';
import { SoundType } from 'src/domains/shared/constants/common.constants';

const HAS_BEEN_LAUNCHED_KEY = 'hasBeenLaunched';

export const defaultUserSettings: UserSettings = {
  soundOnSessionStart: false,
  soundTypeOnSessionStart: SoundType.BELL_BOWL,
  soundOnSessionEnd: false,
  soundTypeOnSessionEnd: SoundType.BELL_BOWL,
  vibrateOnSessionStart: true,
  vibrateOnSessionEnd: true,
  lastSelectedDurationSeconds: DEFAULT_SESSION_DURATION_SECONDS
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Une séance exploitable : objet avec au moins un id et une date (chaînes). Sert
// à écarter un item mal formé *sans* détruire ses voisins valides (cf.
// getMeditationSessions), et non à valider/purger tout le tableau d'un coup.
const isSessionLike = (value: unknown): boolean =>
  isObject(value) && typeof value.id === 'string' && typeof value.date === 'string';

export function setItem<K extends keyof StorageSchema>(key: K, value: StorageSchema[K]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Quota dépassé, ou localStorage indisponible (Safari en navigation privée,
    // stockage désactivé) : on n'interrompt pas l'app. La mise à jour optimiste
    // du state React reste affichée pour la session courante, la persistance est
    // simplement perdue.
    console.warn(`Écriture localStorage impossible (clé « ${key} ») :`, error);
  }
}

const removeItemSafe = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Stockage restreint : rien de plus à faire, l'appelant renvoie null.
  }
};

export function getItem<K extends keyof StorageSchema>(
  key: K,
  // Validateur de forme optionnel : une valeur JSON valide mais de forme
  // inattendue (schéma hérité, altération manuelle) est traitée comme corrompue.
  isValid?: (value: unknown) => boolean
): StorageSchema[K] | null {
  let value: string | null;
  try {
    value = localStorage.getItem(key);
  } catch (error) {
    // Accès au stockage refusé (stockage bloqué) : on dégrade proprement.
    console.warn(`Lecture localStorage impossible (clé « ${key} ») :`, error);
    return null;
  }
  if (value == null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    // JSON invalide : on purge la clé pour éviter un crash au démarrage.
    removeItemSafe(key);
    return null;
  }

  if (isValid && !isValid(parsed)) {
    // Forme inattendue : on purge pour éviter un crash en aval (ex. `.filter`
    // sur une valeur qui n'est pas un tableau).
    removeItemSafe(key);
    return null;
  }

  return parsed as StorageSchema[K];
}

export const initStorageIfFirstLaunch = () => {
  try {
    const hasBeenLaunched = localStorage.getItem(HAS_BEEN_LAUNCHED_KEY);
    if (!hasBeenLaunched) {
      setItem('userSettings', defaultUserSettings);

      localStorage.setItem(HAS_BEEN_LAUNCHED_KEY, 'true');
    }
  } catch (error) {
    // Appelé avant le premier rendu (main.tsx) : une exception ici masquerait
    // toute l'app. On dégrade proprement (l'app tournera avec les défauts).
    console.warn('Initialisation du stockage impossible :', error);
  }
};

/*
 * Meditation sessions
 */

export const getMeditationSessions = (): MeditationSession[] | null => {
  // Validation « est un tableau » uniquement : non destructive. Un seul item
  // hérité/altéré ne doit jamais entraîner la purge de tout l'historique.
  const sessions = getItem('meditationSessions', Array.isArray);
  if (!sessions) return null;
  // On écarte (sans toucher au stockage) d'éventuels items mal formés : ils ne
  // cassent pas l'affichage, et les séances valides voisines sont préservées.
  return sessions.filter((session) => isSessionLike(session) && !session.deletedAt);
};

export const saveMeditationSession = (session: MeditationSession) => {
  const sessions = getItem('meditationSessions', Array.isArray);

  if (!sessions) {
    setItem('meditationSessions', [session]);
    return;
  }

  sessions.push(session);
  setItem('meditationSessions', sessions);
};

export const deleteMeditationSessions = () => {
  setItem('meditationSessions', []);
};

export const deleteMeditationSession = (id: string) => {
  // Lecture du brut (et non de getMeditationSessions qui filtre les soft-deleted),
  // pour ne pas purger d'éventuelles sessions marquées deletedAt.
  const sessions = getItem('meditationSessions', Array.isArray);
  if (!sessions) return;

  const updatedSessions = sessions.filter((session) => session.id !== id);

  setItem('meditationSessions', updatedSessions);
};

export const exportMeditationSessions = async () => {
  try {
    const todayDate = format(new Date(), 'yyyy_MM_dd');
    const fileName = `meditation_data_${todayDate}.json`;

    const sessions = getMeditationSessions() ?? [];
    const jsonString = JSON.stringify(sessions, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Web Share API (avec fichier) si disponible, sinon téléchargement classique.
    const file = new File([blob], fileName, { type: 'application/json' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: fileName });
        return;
      } catch {
        // L'utilisateur a annulé ou le partage a échoué : on retombe sur le téléchargement.
      }
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur lors de l’export des données :', error);
  }
};

/*
 * User Settings
 */

export const getUserSettings = (): UserSettings => {
  // `isObject` écarte une valeur non-objet (chaîne, tableau) qui, étalée,
  // polluerait les réglages (ex. `{...'abc'}` → `{0:'a',1:'b',2:'c'}`).
  const raw = getItem('userSettings', isObject);
  return {
    ...defaultUserSettings,
    ...raw
  };
};

export const saveUserSettings = (settings: Partial<UserSettings>) => {
  const currentSettings = getUserSettings();
  setItem('userSettings', { ...currentSettings, ...settings });
};
