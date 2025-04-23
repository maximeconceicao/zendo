import React from 'react';
import Settings from 'src/domains/settings/components/Settings';
import { useAppData } from 'src/store/useAppData';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import { ScrollView } from 'react-native';
import HorizontalLine from 'src/domains/shared/components/HorizontalLine';

const SettingsScreen = () => {
  const { userSettings, updateUserSettings } = useAppData();

  return (
    <ScreenLayout title="Paramètres">
      <HorizontalLine />
      <ScrollView contentContainerStyle={{ paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        <Settings userSettings={userSettings} updateUserSettings={updateUserSettings} />
      </ScrollView>
      <HorizontalLine />
    </ScreenLayout>
  );
};

export default SettingsScreen;
