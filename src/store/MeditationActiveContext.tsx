import { createContext, ReactNode, useContext, useState } from 'react';

/**
 * État « une séance est en cours » partagé hors de l'écran d'accueil.
 *
 * La séance se déroule en place sur le HomeScreen, mais la navigation par onglets
 * (swipe + indicateur) vit un cran au-dessus (MainTabs). Ce contexte permet à
 * MainTabs de verrouiller le swipe et de masquer l'indicateur pendant la méditation.
 */
type MeditationActiveContextValue = {
  isMeditating: boolean;
  setMeditating: (active: boolean) => void;
};

const MeditationActiveContext = createContext<MeditationActiveContextValue | null>(null);

export const MeditationActiveProvider = ({ children }: { children: ReactNode }) => {
  const [isMeditating, setMeditating] = useState(false);
  return (
    <MeditationActiveContext.Provider value={{ isMeditating, setMeditating }}>
      {children}
    </MeditationActiveContext.Provider>
  );
};

export const useMeditationActive = () => {
  const ctx = useContext(MeditationActiveContext);
  if (!ctx) {
    throw new Error('useMeditationActive doit être utilisé dans un MeditationActiveProvider');
  }
  return ctx;
};
