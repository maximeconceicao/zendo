import { useCallback } from 'react';
import { AllSoundTypes } from 'src/domains/shared/constants/common.constants';
import { playSound as playSoundImpl, stopSound as stopSoundImpl } from 'src/domains/shared/utils/soundPlayer';

export const useSoundPlayer = () => {
  const playSound = useCallback((type: AllSoundTypes) => playSoundImpl(type), []);
  const stopSound = useCallback(() => stopSoundImpl(), []);

  return { playSound, stopSound };
};
