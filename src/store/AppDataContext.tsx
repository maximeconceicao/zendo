import React, { createContext, useState, useEffect } from 'react';
import {
  MeditationQuote,
  MeditationQuoteUpsert,
  MeditationSession,
  UserSettings
} from 'src/data/storage.types';
import {
  defaultUserSettings,
  deleteMeditationSession,
  getMeditationQuotes,
  getMeditationSessions,
  getUserSettings,
  saveMeditationSession,
  saveUserSettings,
  updateMeditationSession,
  upsertMeditationQuote
} from 'src/data/storage';
import { v4 as uuidv4 } from 'uuid';

interface AppData {
  meditationSessions: MeditationSession[] | null;
  userSettings: UserSettings;
  meditationQuotes: MeditationQuote[] | null;
  addSession: (session: MeditationSession) => void;
  updateSession: (session: MeditationSession) => void;
  upsertQuote: (quote: MeditationQuoteUpsert) => void;
  deleteQuote: (quoteId: string) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  deleteSession: (id: string) => void;
}

export const AppDataContext = createContext<AppData | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [appData, setAppData] = useState<AppData>({
    meditationSessions: [],
    userSettings: defaultUserSettings,
    meditationQuotes: [],
    addSession: () => {},
    updateSession: () => {},
    upsertQuote: () => {},
    deleteQuote: () => {},
    updateUserSettings: () => {},
    deleteSession: () => {}
  });

  useEffect(() => {
    const fetchData = async () => {
      const meditationSessions = getMeditationSessions();
      const meditationQuotes = getMeditationQuotes();
      const userSettings = getUserSettings();

      setAppData((prevData) => ({
        ...prevData,
        meditationSessions,
        meditationQuotes,
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

  const deleteSession = async (sessionId: string) => {
    if (!appData.meditationSessions) return;

    const filteredSessions = appData.meditationSessions.filter((s) => s.id !== sessionId);

    setAppData((prevData) => ({
      ...prevData,
      meditationSessions: filteredSessions
    }));
    deleteMeditationSession(sessionId);
  };

  const upsertQuote = async (quote: MeditationQuoteUpsert) => {
    setAppData((prevData) => {
      const existingQuotes = prevData.meditationQuotes || [];
      const quoteExists = existingQuotes.some((q) => q.id === quote.id);
      const updatedQuotes = quoteExists
        ? existingQuotes.map((q) => (q.id === quote.id ? { ...q, ...quote } : q))
        : [...existingQuotes, { ...quote, id: uuidv4(), createdAt: new Date().toISOString() }];
      return {
        ...prevData,
        meditationQuotes: updatedQuotes
      };
    });
    upsertMeditationQuote(quote);
  };

  const deleteQuote = async (quoteId: string) => {
    if (!appData.meditationQuotes) return;

    const filteredQuotes = appData.meditationQuotes.filter((q) => q.id !== quoteId);

    setAppData((prevData) => ({
      ...prevData,
      meditationQuotes: filteredQuotes
    }));
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    setAppData((prevData) => ({
      ...prevData,
      userSettings: { ...prevData.userSettings, ...settings }
    }));
    saveUserSettings(settings);
  };

  return (
    <AppDataContext.Provider
      value={{
        ...appData,
        addSession,
        updateSession,
        upsertQuote,
        deleteQuote,
        updateUserSettings,
        deleteSession
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};
