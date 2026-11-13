import { ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainTabs, { TabKey } from 'src/app/navigation/MainTabs';
import AppShell from 'src/app/navigation/AppShell';
import HomeScreen from 'src/domains/meditation/screens/HomeScreen';
import ActivityScreen from 'src/domains/timeline/screens/ActivityScreen';
import DayScreen from 'src/domains/timeline/screens/DayScreen';
import SettingsScreen from 'src/domains/settings/screens/SettingsScreen';

const tabs: Record<TabKey, ReactNode> = {
  settings: <SettingsScreen />,
  home: <HomeScreen />,
  activity: <ActivityScreen />
};

export const router = createBrowserRouter(
  [
    { path: '/', element: <Navigate to="/home" replace /> },
    {
      path: '/day',
      element: (
        <AppShell>
          <DayScreen />
        </AppShell>
      )
    },
    { path: '/:tab', element: <MainTabs tabs={tabs} /> },
    { path: '*', element: <Navigate to="/home" replace /> }
  ],
  // Sous-chemin GitHub Pages (/zendo/) : les routes sont relatives à la base
  // Vite. BASE_URL contient le slash final, basename n'en veut pas.
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') }
);
