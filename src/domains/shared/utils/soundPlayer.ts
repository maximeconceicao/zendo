import { allSoundFilePaths, AllSoundTypes } from 'src/domains/shared/constants/common.constants';

/**
 * Lecteur audio Web basé sur HTMLAudioElement.
 *
 * - Les éléments sont mis en cache et préchargés (un par fichier son).
 * - Un seul son joue à la fois (canal global), comme sur la version native.
 * - `registerAudioUnlock` contourne la politique d'autoplay (iOS/Safari) en
 *   amorçant les éléments lors du premier geste utilisateur.
 */

const audioCache = new Map<string, HTMLAudioElement>();
let currentlyPlaying: HTMLAudioElement | null = null;
let unlockRegistered = false;

const getAudio = (url: string): HTMLAudioElement => {
  let audio = audioCache.get(url);
  if (!audio) {
    audio = new Audio(url);
    audio.preload = 'auto';
    audioCache.set(url, audio);
  }
  return audio;
};

export const stopSound = () => {
  if (currentlyPlaying) {
    currentlyPlaying.pause();
    currentlyPlaying.currentTime = 0;
    currentlyPlaying = null;
  }
};

export const playSound = (type: AllSoundTypes) => {
  stopSound();
  const audio = getAudio(allSoundFilePaths[type]);
  audio.currentTime = 0;
  currentlyPlaying = audio;
  void audio.play().catch((error) => {
    console.warn('Lecture audio impossible :', error);
  });
};

export const registerAudioUnlock = () => {
  if (unlockRegistered || typeof window === 'undefined') return;
  unlockRegistered = true;

  const unlock = () => {
    Object.values(allSoundFilePaths).forEach((url) => {
      const audio = getAudio(url);
      audio.muted = true;
      void audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch(() => {
          audio.muted = false;
        });
    });
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('touchend', unlock);
  };

  window.addEventListener('pointerdown', unlock, { once: true });
  window.addEventListener('touchend', unlock, { once: true });
};
