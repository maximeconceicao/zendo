import { useState } from 'react';
import { UserSettings } from 'src/data/storage.types';
import { soundLabels, SoundType } from 'src/domains/shared/constants/common.constants';

type SoundKey = 'start' | 'end';

export const useSoundSelectModal = ({
  userSettings,
  updateUserSettings
}: {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}) => {
  const [selectedSoundKey, setSelectedSoundKey] = useState<SoundKey | null>(null);

  const isVisible = selectedSoundKey !== null;

  const soundOptions = Object.values(SoundType).map((type) => ({
    label: soundLabels[type],
    value: type
  }));

  const getValue = (): SoundType | undefined => {
    if (!selectedSoundKey) return undefined;
    return selectedSoundKey === 'start'
      ? userSettings.soundTypeOnSessionStart
      : userSettings.soundTypeOnSessionEnd;
  };

  const onSelect = (value: SoundType) => {
    if (selectedSoundKey === 'start') {
      updateUserSettings({ soundTypeOnSessionStart: value });
    } else if (selectedSoundKey === 'end') {
      updateUserSettings({ soundTypeOnSessionEnd: value });
    }
  };

  const open = (key: SoundKey) => {
    const isEnabled =
      key === 'start' ? userSettings.soundOnSessionStart : userSettings.soundOnSessionEnd;

    if (isEnabled) {
      setSelectedSoundKey(key);
    }
  };

  const close = () => setSelectedSoundKey(null);

  return {
    isVisible,
    soundOptions,
    value: getValue(),
    onSelect,
    onClose: close,
    open
  };
};
