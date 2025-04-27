import { useState } from 'react';
import { UserSettings } from 'src/data/storage.types';
import {
  AllSoundTypes,
  focusSoundLabels,
  FocusSoundType,
  soundLabels,
  SoundType
} from 'src/domains/shared/constants/common.constants';

type SoundKey = 'start' | 'end' | 'focus';

const soundSettingsConfig = {
  start: {
    isEnabled: (settings: UserSettings) => settings.soundOnSessionStart,
    getValue: (settings: UserSettings) => settings.soundTypeOnSessionStart,
    labelMap: soundLabels,
    soundTypes: SoundType,
    updateKey: 'soundTypeOnSessionStart' as const
  },
  end: {
    isEnabled: (settings: UserSettings) => settings.soundOnSessionEnd,
    getValue: (settings: UserSettings) => settings.soundTypeOnSessionEnd,
    labelMap: soundLabels,
    soundTypes: SoundType,
    updateKey: 'soundTypeOnSessionEnd' as const
  },
  focus: {
    isEnabled: (settings: UserSettings) => settings.soundOnFocus,
    getValue: (settings: UserSettings) => settings.soundTypeOnFocus,
    labelMap: focusSoundLabels,
    soundTypes: FocusSoundType,
    updateKey: 'soundTypeOnFocus' as const
  }
};

export const useSoundSelectModal = ({
  userSettings,
  updateUserSettings
}: {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}) => {
  const [selectedSoundKey, setSelectedSoundKey] = useState<SoundKey | null>(null);

  const isVisible = selectedSoundKey !== null;

  const soundOptions = selectedSoundKey
    ? Object.values(soundSettingsConfig[selectedSoundKey].soundTypes).map((type) => {
        const labelMap = soundSettingsConfig[selectedSoundKey].labelMap as Record<string, string>;
        return {
          label: labelMap[type],
          value: type
        };
      })
    : [];

  const onSelect = (value: AllSoundTypes) => {
    if (!selectedSoundKey) return;

    const { updateKey } = soundSettingsConfig[selectedSoundKey];
    updateUserSettings({ [updateKey]: value } as Partial<UserSettings>);
  };

  const open = (key: SoundKey) => {
    if (soundSettingsConfig[key].isEnabled(userSettings)) {
      setSelectedSoundKey(key);
    }
  };

  const close = () => setSelectedSoundKey(null);

  const value = selectedSoundKey
    ? soundSettingsConfig[selectedSoundKey].getValue(userSettings)
    : undefined;

  return {
    isVisible,
    soundOptions,
    value,
    onSelect,
    onClose: close,
    open
  };
};
