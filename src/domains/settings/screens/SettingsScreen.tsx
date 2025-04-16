import React from 'react';
import Settings from 'src/domains/settings/components/Settings';
import { useAppData } from 'src/store/useAppData';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';

const SettingsScreen = () => {
  const { userSettings, updateUserSettings } = useAppData();

  return (
    <ScreenLayout title="Paramètres">
      <Settings userSettings={userSettings} updateUserSettings={updateUserSettings} />
    </ScreenLayout>
  );
};

export default SettingsScreen;
