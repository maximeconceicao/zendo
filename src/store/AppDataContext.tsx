import React, { createContext, useState, useEffect, useMemo } from 'react';
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
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[] | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [meditationQuotes, setMeditationQuotes] = useState<MeditationQuote[] | null>(null);

  useEffect(() => {
    const fetchData = () => {
      setMeditationSessions(getMeditationSessions());
      setMeditationQuotes(getMeditationQuotes());
      setUserSettings(getUserSettings());
    };

    fetchData();
  }, []);

  const addSession = async (session: MeditationSession) => {
    setMeditationSessions((prev) => (prev ? [...prev, session] : [session]));
    saveMeditationSession(session);
  };

  const updateSession = async (session: MeditationSession) => {
    setMeditationSessions(
      (prev) => prev?.map((s) => (s.id === session.id ? { ...s, ...session } : s)) || []
    );
    updateMeditationSession(session);
  };

  const deleteSession = async (sessionId: string) => {
    setMeditationSessions((prev) => prev?.filter((s) => s.id !== sessionId) || []);
    deleteMeditationSession(sessionId);
  };

  const upsertQuote = async (quote: MeditationQuoteUpsert) => {
    setMeditationQuotes((prev) => {
      const existingQuotes = prev || [];
      const quoteExists = existingQuotes.some((q) => q.id === quote.id);
      const updatedQuotes = quoteExists
        ? existingQuotes.map((q) => (q.id === quote.id ? { ...q, ...quote } : q))
        : [...existingQuotes, { ...quote, id: uuidv4(), createdAt: new Date().toISOString() }];
      return updatedQuotes;
    });
    upsertMeditationQuote(quote);
  };

  const deleteQuote = async (quoteId: string) => {
    setMeditationQuotes((prev) => prev?.filter((q) => q.id !== quoteId) || []);
  };

  const updateUserSettings = async (settings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...settings }));
    saveUserSettings(settings);
  };

  const contextValue = useMemo(
    () => ({
      meditationSessions,
      userSettings,
      meditationQuotes,
      addSession,
      updateSession,
      upsertQuote,
      deleteQuote,
      updateUserSettings,
      deleteSession
    }),
    [meditationSessions, userSettings, meditationQuotes]
  );

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
};
