export enum SoundType {
  BELL_BOWL = 'bell_bowl',
  BELLS = 'bells',
  COPPER_BELL_1 = 'copper_bell_1',
  COPPER_BELL_2 = 'copper_bell_2',
  REVERSE_BELL = 'reverse_bell'
}

export const soundFilePaths: Record<SoundType, any> = {
  [SoundType.BELL_BOWL]: require('src/assets/sounds/bell-bowl.mp3'),
  [SoundType.BELLS]: require('src/assets/sounds/bells.mp3'),
  [SoundType.COPPER_BELL_1]: require('src/assets/sounds/copper-bell-1.mp3'),
  [SoundType.COPPER_BELL_2]: require('src/assets/sounds/copper-bell-2.mp3'),
  [SoundType.REVERSE_BELL]: require('src/assets/sounds/reverse-bell.mp3')
};

export const soundLabels: Record<SoundType, string> = {
  [SoundType.BELL_BOWL]: 'Bell Bowl',
  [SoundType.BELLS]: 'Bells',
  [SoundType.COPPER_BELL_1]: 'Copper Bell 1',
  [SoundType.COPPER_BELL_2]: 'Copper Bell 2',
  [SoundType.REVERSE_BELL]: 'Reverse Bell'
};
