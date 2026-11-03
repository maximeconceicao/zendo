import bellBowl from 'src/assets/sounds/bell-bowl.mp3';
import bells from 'src/assets/sounds/bells.mp3';
import copperBell1 from 'src/assets/sounds/copper-bell-1.mp3';
import copperBell2 from 'src/assets/sounds/copper-bell-2.mp3';
import reverseBell from 'src/assets/sounds/reverse-bell.mp3';

export enum SoundType {
  BELL_BOWL = 'bell_bowl',
  BELLS = 'bells',
  COPPER_BELL_1 = 'copper_bell_1',
  COPPER_BELL_2 = 'copper_bell_2',
  REVERSE_BELL = 'reverse_bell'
}

export type AllSoundTypes = SoundType;

// Vite transforme chaque import d'asset en URL (string) utilisable par HTMLAudioElement.
export const allSoundFilePaths: Record<AllSoundTypes, string> = {
  [SoundType.BELL_BOWL]: bellBowl,
  [SoundType.BELLS]: bells,
  [SoundType.COPPER_BELL_1]: copperBell1,
  [SoundType.COPPER_BELL_2]: copperBell2,
  [SoundType.REVERSE_BELL]: reverseBell
};

export const soundLabels: Record<SoundType, string> = {
  [SoundType.BELL_BOWL]: 'Bell Bowl',
  [SoundType.BELLS]: 'Bells',
  [SoundType.COPPER_BELL_1]: 'Copper Bell 1',
  [SoundType.COPPER_BELL_2]: 'Copper Bell 2',
  [SoundType.REVERSE_BELL]: 'Reverse Bell'
};
