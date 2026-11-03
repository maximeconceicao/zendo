import { useEffect, useRef, useState } from 'react';
import { Modal } from 'src/domains/shared/components/ui/Modal';
import { Text } from 'src/domains/shared/components/ui/Text';

const STEP = 5;
const MIN = 5;
const MAX = 60;
// Valeurs proposées : 5, 10, … 60 minutes.
const VALUES = Array.from({ length: (MAX - MIN) / STEP + 1 }, (_, i) => MIN + i * STEP);

// Durée de l'animation de fermeture (doit rester alignée sur les transitions CSS).
const CLOSE_MS = 180;

// Ramène n'importe quelle durée (secondes) sur la graduation la plus proche.
const clampToStep = (seconds: number) => {
  const minutes = Math.round(seconds / 60 / STEP) * STEP;
  return Math.min(MAX, Math.max(MIN, minutes));
};

type DurationPickerProps = {
  visible: boolean;
  valueSeconds: number;
  onClose: () => void;
  onConfirm: (seconds: number) => void;
};

export const DurationPicker = ({ visible, valueSeconds, onClose, onConfirm }: DurationPickerProps) => {
  const [selected, setSelected] = useState(() => clampToStep(valueSeconds));
  // Phase de sortie : on joue le glissement + fondu avant de démonter la modale.
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  // À l'ouverture : on resynchronise la sélection et on réarme l'état.
  useEffect(() => {
    if (visible) {
      setSelected(clampToStep(valueSeconds));
      setClosing(false);
    }
    return () => window.clearTimeout(closeTimer.current);
  }, [visible, valueSeconds]);

  // Lance l'animation de sortie puis exécute l'action finale (fermeture/validation).
  const animateClose = (after?: () => void) => {
    if (closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      after?.();
      onClose();
    }, CLOSE_MS);
  };

  const choose = (minutes: number) => {
    setSelected(minutes);
    animateClose(() => onConfirm(minutes * 60));
  };

  return (
    <Modal visible={visible} onRequestClose={() => animateClose()}>
      <div
        className={`flex flex-1 flex-col items-center justify-end bg-black/40 transition-opacity duration-200 ease-out ${
          closing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={() => animateClose()}
      >
        <div
          className="flex w-full max-w-[480px] flex-col rounded-t-3xl bg-platinium px-6 pt-7 pb-9"
          onClick={(e) => e.stopPropagation()}
        >
          <Text className="mb-7 text-center text-xs tracking-[0.3em] text-gray-400">DURÉE</Text>

          {/* Grille de durées : on tape, ça valide. Aucun défilement, aucun bouton. */}
          <div className="grid grid-cols-3 gap-3">
            {VALUES.map((minutes) => {
              const isActive = minutes === selected;
              return (
                <button
                  key={minutes}
                  type="button"
                  onClick={() => choose(minutes)}
                  className={`flex flex-col items-center justify-center rounded-2xl border py-4 transition-colors duration-200 ${
                    isActive ? 'border-transparent bg-ink/90' : 'border-ink/[0.12]'
                  }`}
                >
                  <Text className={`text-lg ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {minutes} min
                  </Text>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DurationPicker;
