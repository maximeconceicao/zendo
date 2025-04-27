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

export const useSoundSelectModal = ({
  userSettings,
  updateUserSettings
}: {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}) => {
  const [selectedSoundKey, setSelectedSoundKey] = useState<SoundKey | null>(null);

  const isVisible = selectedSoundKey !== null;

  const soundTypeMap = {
    start: SoundType,
    end: SoundType,
    focus: FocusSoundType
  };

  const labelMap = {
    start: soundLabels,
    end: soundLabels,
    focus: focusSoundLabels
  };

  const enabledMap = {
    start: userSettings.soundOnSessionStart,
    end: userSettings.soundOnSessionEnd,
    focus: userSettings.soundOnFocus
  };

  const getValueMap = {
    start: userSettings.soundTypeOnSessionStart,
    end: userSettings.soundTypeOnSessionEnd,
    focus: userSettings.soundTypeOnFocus
  };

  const soundOptions = selectedSoundKey
    ? Object.values(soundTypeMap[selectedSoundKey]).map((type) => ({
        label: labelMap[selectedSoundKey][type as keyof (typeof labelMap)[SoundKey]],
        value: type
      }))
    : [];

  const onSelect = (value: AllSoundTypes) => {
    if (!selectedSoundKey) return;
    if (selectedSoundKey === 'focus') {
      updateUserSettings({ soundTypeOnFocus: value as FocusSoundType });
    } else {
      updateUserSettings({
        [selectedSoundKey === 'start' ? 'soundTypeOnSessionStart' : 'soundTypeOnSessionEnd']:
          value as SoundType
      });
    }
  };

  const open = (key: SoundKey) => {
    if (enabledMap[key]) {
      setSelectedSoundKey(key);
    }
  };

  const close = () => setSelectedSoundKey(null);

  return {
    isVisible,
    soundOptions,
    value: selectedSoundKey ? getValueMap[selectedSoundKey] : undefined,
    onSelect,
    onClose: close,
    open
  };
};
