import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  defaultUserSettings,
  getItem,
  getMeditationSessions,
  getUserSettings,
  initStorageIfFirstLaunch,
  saveMeditationSession,
  setItem
} from 'src/data/storage';
import { MeditationSession } from 'src/data/storage.types';

const makeSession = (id: string, deletedAt?: string): MeditationSession => ({
  id,
  date: '2026-01-01T10:00:00.000Z',
  plannedDurationSeconds: 600,
  actualDurationSeconds: 600,
  deletedAt
});

beforeEach(() => {
  localStorage.clear();
});

describe('storage (localStorage)', () => {
  test('setItem/getItem round-trip JSON', () => {
    setItem('meditationSessions', [makeSession('a')]);
    expect(getItem('meditationSessions')).toEqual([makeSession('a')]);
  });

  test('getItem returns null for missing key', () => {
    expect(getItem('meditationSessions')).toBeNull();
  });

  test('initStorageIfFirstLaunch seeds defaults once', () => {
    initStorageIfFirstLaunch();
    expect(getUserSettings().vibrateOnSessionStart).toBe(true);

    // Un second appel ne réinitialise pas les données existantes.
    saveMeditationSession(makeSession('seed'));
    initStorageIfFirstLaunch();
    expect(getMeditationSessions()?.map((s) => s.id)).toEqual(['seed']);
  });

  test('getMeditationSessions filters soft-deleted sessions', () => {
    setItem('meditationSessions', [makeSession('a'), makeSession('b', '2026-02-01T00:00:00.000Z')]);
    const sessions = getMeditationSessions();
    expect(sessions?.map((s) => s.id)).toEqual(['a']);
  });

  test('saveMeditationSession appends', () => {
    saveMeditationSession(makeSession('a'));
    saveMeditationSession(makeSession('b'));
    expect(getMeditationSessions()?.map((s) => s.id)).toEqual(['a', 'b']);
  });
});

describe('storage robustness', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('setItem swallows write errors (quota / unavailable storage)', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => setItem('userSettings', defaultUserSettings)).not.toThrow();
  });

  test('initStorageIfFirstLaunch does not throw when a write fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => initStorageIfFirstLaunch()).not.toThrow();
  });

  test('getItem purges invalid JSON and returns null', () => {
    localStorage.setItem('meditationSessions', '{ broken json');
    expect(getItem('meditationSessions')).toBeNull();
    expect(localStorage.getItem('meditationSessions')).toBeNull();
  });

  test('getMeditationSessions purges a non-array value instead of crashing', () => {
    // Valeur JSON valide mais pas un tableau (schéma hérité / altération) :
    // sans garde, `.filter` lèverait « filter is not a function ».
    localStorage.setItem('meditationSessions', JSON.stringify({ not: 'an array' }));
    expect(getMeditationSessions()).toBeNull();
    expect(localStorage.getItem('meditationSessions')).toBeNull();
  });

  test('getMeditationSessions drops malformed items but keeps valid siblings', () => {
    // Un seul enregistrement hérité/altéré ne doit JAMAIS effacer l'historique.
    localStorage.setItem('meditationSessions', JSON.stringify([makeSession('ok'), { foo: 1 }]));
    expect(getMeditationSessions()?.map((s) => s.id)).toEqual(['ok']);
    // Les séances valides restent sur disque : pas de purge destructive.
    expect(localStorage.getItem('meditationSessions')).not.toBeNull();
  });

  test('getItem returns null (no throw) when the storage read is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('SecurityError');
    });
    expect(() => getItem('meditationSessions')).not.toThrow();
    expect(getItem('meditationSessions')).toBeNull();
  });

  test('getUserSettings falls back to defaults for a non-object value', () => {
    localStorage.setItem('userSettings', JSON.stringify('corrupt'));
    expect(getUserSettings()).toEqual(defaultUserSettings);
  });
});
