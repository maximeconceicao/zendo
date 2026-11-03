import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minuteur de séance ancré sur l'horloge réelle (`Date.now()`).
 *
 * Contrairement à un simple compteur de ticks `setInterval`, l'écoulé est
 * recalculé à partir du temps réel : le décompte reste fiable même si l'onglet
 * est mis en arrière-plan (où les intervalles sont throttlés). `timeLeft` peut
 * devenir négatif une fois la durée prévue dépassée (affichage « +mm:ss »).
 */
const useSessionTimer = (initialTime: number = 60, autoStart: boolean = true) => {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Temps déjà écoulé lors des périodes « en marche » précédentes.
  const accumulatedMsRef = useRef(0);
  // Horodatage de début de la période en cours (null quand en pause).
  const runStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    if (runStartRef.current === null) {
      runStartRef.current = Date.now();
    }

    const computeElapsed = () => {
      const runningMs = runStartRef.current !== null ? Date.now() - runStartRef.current : 0;
      setElapsedTime(Math.floor((accumulatedMsRef.current + runningMs) / 1000));
    };

    computeElapsed();
    const intervalId = setInterval(computeElapsed, 250);
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const start = useCallback(() => {
    if (runStartRef.current === null) {
      runStartRef.current = Date.now();
    }
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (runStartRef.current !== null) {
      accumulatedMsRef.current += Date.now() - runStartRef.current;
      runStartRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    accumulatedMsRef.current = 0;
    runStartRef.current = null;
    setElapsedTime(0);
    setIsRunning(false);
  }, []);

  const timeLeft = initialTime - elapsedTime;

  return { timeLeft, elapsedTime, isRunning, start, pause, reset };
};

export default useSessionTimer;
