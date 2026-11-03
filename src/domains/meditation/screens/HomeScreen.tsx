import { useEffect, useMemo, useRef, useState } from 'react';
import { Hourglass, Pause, Play } from 'lucide-react';
import { Button } from 'src/domains/shared/components/ui/Button';
import { Text } from 'src/domains/shared/components/ui/Text';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import DurationPicker from 'src/domains/meditation/components/DurationPicker';
import MeditatingFace from 'src/domains/meditation/components/MeditatingFace';
import { useAppData } from 'src/store/useAppData';
import { useMeditationActive } from 'src/store/MeditationActiveContext';
import {
  DEFAULT_SESSION_DURATION_SECONDS,
  END_SESSION_VIBRATION_PATTERN,
  START_SESSION_VIBRATION_PATTERN
} from 'src/domains/meditation/constants/session.constants';
import useSessionTimer from 'src/domains/meditation/hooks/useSessionTimer';
import { useKeepAwake } from 'src/domains/shared/hooks/useKeepAwake';
import { useSoundPlayer } from 'src/domains/shared/hooks/useSoundPlayer';
import { vibrate } from 'src/domains/shared/utils/device.utils';
import { MeditationSession } from 'src/data/storage.types';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const HomeScreen = () => {
  const { userSettings, updateUserSettings, addSession } = useAppData();
  const { playSound } = useSoundPlayer();
  const { isMeditating, setMeditating } = useMeditationActive();

  const lastSelectedDurationSeconds =
    userSettings?.lastSelectedDurationSeconds || DEFAULT_SESSION_DURATION_SECONDS;

  const [durationSeconds, setDurationSeconds] = useState(lastSelectedDurationSeconds);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [meditationSession, setMeditationSession] = useState<MeditationSession | null>(null);

  const { timeLeft, elapsedTime, isRunning, start, pause, reset } = useSessionTimer(
    durationSeconds,
    false
  );

  // La séance a atteint sa durée : minuteur figé à zéro, en attente de clôture.
  const isFinished = isMeditating && timeLeft <= 0;

  // L'écran reste allumé uniquement pendant la séance.
  useKeepAwake(isMeditating);

  // Le son de fin ne doit sonner qu'une fois au franchissement de la durée prévue.
  const endSoundFired = useRef(false);

  useEffect(() => {
    if (!isMeditating) setDurationSeconds(lastSelectedDurationSeconds);
  }, [lastSelectedDurationSeconds, isMeditating]);

  useEffect(() => {
    if (!isMeditating) return;
    // Franchissement du seuil (et non égalité stricte) : avec l'ancrage Date.now,
    // timeLeft peut sauter 0 (onglet en arrière-plan / throttling).
    if (timeLeft <= 0 && !endSoundFired.current) {
      endSoundFired.current = true;
      if (userSettings.vibrateOnSessionEnd) {
        vibrate(END_SESSION_VIBRATION_PATTERN);
      }
      if (userSettings.soundOnSessionEnd) {
        playSound(userSettings.soundTypeOnSessionEnd);
      }
      // Le minuteur s'arrête à zéro : on fige l'écoulé (plus de décompte négatif).
      pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isMeditating]);

  const formattedDuration = useMemo(() => {
    const totalMinutes = Math.round(durationSeconds / 60);
    if (totalMinutes <= 60) return `${totalMinutes} min`;
    return `${Math.floor(totalMinutes / 60)} h ${totalMinutes % 60} min`;
  }, [durationSeconds]);

  const startMeditation = () => {
    if (durationSeconds !== lastSelectedDurationSeconds) {
      updateUserSettings({ lastSelectedDurationSeconds: durationSeconds });
    }

    endSoundFired.current = false;
    setMeditationSession({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      plannedDurationSeconds: durationSeconds,
      actualDurationSeconds: 0
    });

    setMeditating(true);
    // Repart d'un minuteur vierge : le teardown ne réinitialise pas (il fige la
    // valeur affichée pendant le fondu de sortie), on le fait donc ici.
    reset();
    start();

    if (userSettings.vibrateOnSessionStart) {
      vibrate(START_SESSION_VIBRATION_PATTERN);
    }
    if (userSettings.soundOnSessionStart) {
      playSound(userSettings.soundTypeOnSessionStart);
    }
  };

  // Retour à l'accueil : on repasse en mode non-méditation, la mise en page se
  // charge du fondu (seule la tête reste). Le minuteur est réinitialisé au
  // prochain démarrage pour éviter tout saut de valeur pendant la transition.
  const returnToHome = () => {
    endSoundFired.current = false;
    setMeditationSession(null);
    setMeditating(false);
  };

  const saveSession = () => {
    if (meditationSession) {
      addSession({ ...meditationSession, actualDurationSeconds: elapsedTime });
    }
    returnToHome();
  };

  return (
    <ScreenLayout title="Zendō" headerHidden={isMeditating}>
      {/* Tête centrée verticalement — inchangée d'une phase à l'autre. Le timer
          est posé en absolu sous la tête pour ne pas décaler son centrage. */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative">
          <MeditatingFace />

          <div
            className={`absolute inset-x-0 top-full mt-8 text-center transition-opacity duration-700 ${
              isMeditating ? 'opacity-100 delay-500' : 'opacity-0'
            }`}
            aria-hidden={!isMeditating}
          >
            <Text className="text-2xl tracking-[0.25em] text-gray-400">
              {formatTime(Math.max(timeLeft, 0))}
            </Text>
          </div>
        </div>
      </div>

      {/* Zone de contrôles basse : empreinte stable, accueil et séance se
          fondent l'un dans l'autre sans décaler la mise en page. */}
      <div className="relative flex flex-col">
        {/* Accueil : choix de durée + bouton Démarrer. */}
        <div
          className={`flex flex-col transition-opacity duration-500 ${
            isMeditating ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          aria-hidden={isMeditating}
        >
          <button
            type="button"
            className="flex w-full flex-row items-center justify-between p-4"
            onClick={() => setPickerOpen(true)}
          >
            <span className="flex flex-row items-center">
              <Hourglass size={20} className="text-black" />
              <Text className="pl-3 text-base leading-5">DURÉE</Text>
            </span>
            <Text className="text-base leading-5">{formattedDuration}</Text>
          </button>

          <div className="mx-4 mb-2 border-b border-gray-300" />

          <div className="flex flex-col py-9">
            <Button
              variant="primary"
              className="w-full rounded-full p-4 text-lg"
              onClick={startMeditation}
            >
              Démarrer la méditation
            </Button>
          </div>
        </div>

        {/* Séance : un seul bouton Pause en cours ; en pause, il devient Play et
            dévoile les deux options (quitter / enregistrer). Une fois la durée
            atteinte, tout est remplacé par « Terminer la session ». */}
        <div
          className={`absolute inset-x-0 bottom-0 flex flex-col transition-opacity duration-700 ${
            isMeditating ? 'opacity-100 delay-[900ms]' : 'pointer-events-none opacity-0'
          }`}
          aria-hidden={!isMeditating}
        >
          {/* Les deux états sont superposés pour un fondu enchaîné : les contrôles
              (pause / options) s'estompent, puis « Terminer la session » apparaît
              (delay) une fois le bouton pause disparu. */}
          <div className="relative flex flex-col">
            <div
              className={`flex flex-col transition-opacity duration-500 ${
                isFinished ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
              aria-hidden={isFinished}
            >
              <div className="flex flex-col items-center gap-6 pb-6">
                <Button
                  variant="subtle"
                  onClick={isRunning ? pause : start}
                  aria-label={isRunning ? 'Mettre en pause' : 'Reprendre'}
                  className="h-16 w-16 rounded-full"
                >
                  {isRunning ? (
                    <Pause size={24} strokeWidth={1.25} className="text-gray-500" />
                  ) : (
                    <Play size={24} strokeWidth={1.25} className="text-gray-500" />
                  )}
                </Button>

                {/* Toujours présents (place réservée) pour que le bouton Pause ne
                    bouge pas : on ne joue que sur l'opacité entre marche et pause. */}
                <div
                  className={`flex flex-row items-center justify-center gap-4 transition-opacity duration-300 ${
                    isRunning ? 'pointer-events-none opacity-0' : 'opacity-100'
                  }`}
                  aria-hidden={isRunning}
                >
                  <Button
                    variant="outline"
                    onClick={returnToHome}
                    aria-label="Quitter sans enregistrer"
                    className="rounded-full px-7 py-3 text-base text-red-500"
                  >
                    Quitter
                  </Button>
                  <Button
                    variant="primary"
                    onClick={saveSession}
                    aria-label="Enregistrer et quitter"
                    className="rounded-full px-7 py-3 text-base"
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`absolute inset-0 flex flex-col justify-center transition-opacity duration-500 ${
                isFinished ? 'opacity-100 delay-500' : 'pointer-events-none opacity-0'
              }`}
              aria-hidden={!isFinished}
            >
              <div className="flex w-full flex-col">
                <Button
                  variant="primary"
                  onClick={saveSession}
                  aria-label="Terminer la session"
                  className="w-full rounded-full p-4 text-lg"
                >
                  Terminer la session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DurationPicker
        visible={pickerOpen}
        valueSeconds={durationSeconds}
        onClose={() => setPickerOpen(false)}
        onConfirm={setDurationSeconds}
      />
    </ScreenLayout>
  );
};

export default HomeScreen;
