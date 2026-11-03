import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { MeditationSession, UserSettings } from 'src/data/storage.types';
import {
  defaultUserSettings,
  deleteMeditationSession,
  deleteMeditationSessions,
  getMeditationSessions,
  getUserSettings,
  saveMeditationSession,
  saveUserSettings
} from 'src/data/storage';

interface AppData {
  meditationSessions: MeditationSession[] | null;
  userSettings: UserSettings;
  addSession: (session: MeditationSession) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  deleteSession: (id: string) => void;
  deleteAllSessions: () => void;
}

export const AppDataContext = createContext<AppData | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[] | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);

  useEffect(() => {
    const fetchData = () => {
      setMeditationSessions(getMeditationSessions());
      setUserSettings(getUserSettings());
    };

    fetchData();
  }, []);

  const addSession = useCallback((session: MeditationSession) => {
    setMeditationSessions((prev) => (prev ? [...prev, session] : [session]));
    saveMeditationSession(session);
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setMeditationSessions((prev) => prev?.filter((s) => s.id !== sessionId) || []);
    deleteMeditationSession(sessionId);
  }, []);

  const deleteAllSessions = useCallback(() => {
    setMeditationSessions([]);
    deleteMeditationSessions();
  }, []);

  const updateUserSettings = useCallback((settings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...settings }));
    saveUserSettings(settings);
  }, []);

  const contextValue = useMemo(
    () => ({
      meditationSessions,
      userSettings,
      addSession,
      updateUserSettings,
      deleteSession,
      deleteAllSessions
    }),
    [
      meditationSessions,
      userSettings,
      addSession,
      updateUserSettings,
      deleteSession,
      deleteAllSessions
    ]
  );

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
};
