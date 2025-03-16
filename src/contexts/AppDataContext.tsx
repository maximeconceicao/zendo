import React, { createContext, useState, useEffect } from 'react';
import { MeditationSession, UserSettings } from 'src/types/storage.types';
import {
  getMeditationSessions,
  getUserSettings,
  saveMeditationSession,
  saveUserSettings,
  updateMeditationSession
} from 'src/utils/storage';

interface AppData {
  meditationSessions: MeditationSession[] | null;
  userSettings: UserSettings | null;
  addSession: (session: MeditationSession) => void;
  updateSession: (session: MeditationSession) => void;
  updateUserSettings: (settings: UserSettings) => void;
}

export const AppDataContext = createContext<AppData | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [appData, setAppData] = useState<AppData>({
    meditationSessions: null,
    userSettings: null,
    addSession: () => {},
    updateSession: () => {},
    updateUserSettings: () => {}
  });

  useEffect(() => {
    const fetchData = async () => {
      const meditationSessions = getMeditationSessions();
      const userSettings = getUserSettings();

      setAppData((prevData) => ({
        ...prevData,
        meditationSessions,
        userSettings
      }));
    };

    fetchData();
  }, []);

  const addSession = async (session: MeditationSession) => {
    const newSessions = appData.meditationSessions
      ? [...appData.meditationSessions, session]
      : [session];
    setAppData((prevData) => ({
      ...prevData,
      meditationSessions: newSessions
    }));
    saveMeditationSession(session);
  };

  const updateSession = async (session: MeditationSession) => {
    if (!appData.meditationSessions) return;

    const updatedSessions = appData.meditationSessions.map((s) =>
      s.id === session.id ? { ...s, ...session } : s
    );

    setAppData((prevData) => ({
      ...prevData,
      meditationSessions: updatedSessions
    }));
    updateMeditationSession(session);
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    setAppData((prevData) => ({
      ...prevData,
      userSettings: { ...prevData.userSettings, ...settings }
    }));
    console.log('appData.userSettings', appData.userSettings);
    saveUserSettings(settings);
  };

  return (
    <AppDataContext.Provider
      value={{
        ...appData,
        addSession,
        updateSession,
        updateUserSettings
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
