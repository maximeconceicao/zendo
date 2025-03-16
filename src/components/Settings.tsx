import React, { useState } from 'react';
import { View } from 'react-native';
import { SettingOption } from 'src/types/setting.types';
import { UserSettings } from 'src/types/storage.types';
import {
  deleteMeditationSessions,
  exportMeditationSessions,
  softDeleteMeditationSessions
} from 'src/utils/storage';
import CustomAlert from './CustomAlert';
import SettingGroup from './SettingGroup';

const Settings = ({
  userSettings,
  updateUserSettings
}: {
  userSettings: UserSettings | null;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}) => {
  console.log('userSettings', userSettings);
  const [alertVisible, setAlertVisible] = useState(false);

  const sessionOptions: SettingOption[] = [
    {
      id: '1',
      title: 'Vibration au recentrage',
      type: 'switch',
      value: Boolean(userSettings?.vibrateOnFocus),
      onToggle: () => updateUserSettings({ vibrateOnFocus: !Boolean(userSettings?.vibrateOnFocus) })
    },
    {
      id: '2',
      title: 'Vibration en début de session',
      type: 'switch',
      value: Boolean(userSettings?.vibrateOnSessionStart),
      onToggle: () =>
        updateUserSettings({
          vibrateOnSessionStart: !Boolean(userSettings?.vibrateOnSessionStart)
        })
    },
    {
      id: '3',
      title: 'Vibration en fin de session',
      type: 'switch',
      value: Boolean(userSettings?.vibrateOnSessionEnd),
      onToggle: () =>
        updateUserSettings({
          vibrateOnSessionEnd: !Boolean(userSettings?.vibrateOnSessionEnd)
        })
    }
  ];

  const dataOptions: SettingOption[] = [
    {
      id: '1',
      title: 'Exporter les données',
      type: 'button',
      onPress: exportMeditationSessions
    },
    {
      id: '2',
      title: 'Supprimer les données',
      type: 'button',
      onPress: () => setAlertVisible(true),
      className: 'text-red-400'
    }
  ];

  return (
    <View className="mt-4">
      <SettingGroup
        title="Session"
        description="Personnalisez votre expérience"
        settings={sessionOptions}
      />
      <SettingGroup title="Données" description="Gestion des données" settings={dataOptions} />
      <CustomAlert
        visible={alertVisible}
        title="Confirmation"
        message="Êtes-vous sûr de vouloir supprimer toutes les séances de méditation ? Cette action est irréversible."
        onClose={() => setAlertVisible(false)}
        onConfirm={() => {
          deleteMeditationSessions();
          setAlertVisible(false);
        }}
      />
    </View>
  );
};

export default Settings;
