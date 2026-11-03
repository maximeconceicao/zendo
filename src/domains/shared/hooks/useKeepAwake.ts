import { useEffect } from 'react';

/**
 * Maintient l'écran allumé via la Screen Wake Lock API, le temps que le
 * composant est monté. Remplace `expo-keep-awake`.
 *
 * Support partiel selon les navigateurs (OK Chrome/Edge, variable Safari) :
 * en cas d'indisponibilité ou de refus, dégradation gracieuse (no-op).
 */
export const useKeepAwake = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    let wakeLock: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      if (!('wakeLock' in navigator)) return;
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        // Le système libère le verrou en arrière-plan : on annule la référence
        // pour pouvoir le redemander au retour au premier plan.
        wakeLock.addEventListener('release', () => {
          wakeLock = null;
        });
      } catch {
        // Refusé / non disponible : on ignore.
      }
    };

    // Le verrou est libéré automatiquement quand l'onglet passe en arrière-plan ;
    // on le redemande au retour au premier plan.
    const handleVisibilityChange = () => {
      if (!cancelled && wakeLock === null && document.visibilityState === 'visible') {
        void request();
      }
    };

    void request();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      void wakeLock?.release().catch(() => {});
      wakeLock = null;
    };
  }, [enabled]);
};
