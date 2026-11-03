/**
 * Déclenche une vibration selon un motif (ms), si l'appareil le supporte.
 * Non supporté sur iOS Safari → no-op silencieux (dégradation gracieuse).
 */
export const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignoré : la vibration est une amélioration facultative.
    }
  }
};
