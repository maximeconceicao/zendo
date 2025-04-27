import { Audio, AVPlaybackStatus } from 'expo-av';
import { useRef } from 'react';
import { allSoundFilePaths, AllSoundTypes } from '../constants/common.constants';

export const useSoundPlayer = () => {
  const currentSoundRef = useRef<Audio.Sound | null>(null);

  const stopSound = async () => {
    if (currentSoundRef.current) {
      await currentSoundRef.current.stopAsync();
      await currentSoundRef.current.unloadAsync();
      currentSoundRef.current = null;
    }
  };

  const playSound = async (type: AllSoundTypes) => {
    await stopSound();

    const { sound } = await Audio.Sound.createAsync(allSoundFilePaths[type], { shouldPlay: true });

    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
        currentSoundRef.current = null;
      }
    });

    currentSoundRef.current = sound;
  };

  return {
    playSound,
    stopSound
  };
};
