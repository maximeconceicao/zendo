import React from 'react';
import Settings from 'src/components/Settings';
import { useAppData } from 'src/hooks/useAppData';
import ScreenLayout from 'src/layouts/ScreenLayout';

const SettingsScreen = () => {
  const { userSettings, updateUserSettings } = useAppData();

  return (
    <ScreenLayout title="Paramètres">
      <Settings userSettings={userSettings} updateUserSettings={updateUserSettings} />
    </ScreenLayout>
  );
};

export default SettingsScreen;
