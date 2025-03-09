import React from 'react';
import { UserSettings } from 'src/types/storage.types';
import SettingGroup from './SettingGroup';
import { View } from 'react-native';
import { SettingOption } from 'src/types/setting.types';

const Settings = ({
  userSettings,
  updateUserSettings
}: {
  userSettings: UserSettings | null;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}) => {
  console.log('userSettings', userSettings);
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
      onPress: () => {}
    }
  ];

  return (
    <View>
      <SettingGroup title="Session" settings={sessionOptions} />
      <SettingGroup title="Données" settings={dataOptions} />
    </View>
  );
};

export default Settings;
