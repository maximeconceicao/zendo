import { useEffect } from 'react';
import { Modal } from 'src/domains/shared/components/ui/Modal';
import { AllSoundTypes, SoundType } from 'src/domains/shared/constants/common.constants';
import { useSoundPlayer } from 'src/domains/shared/hooks/useSoundPlayer';
import { Text } from 'src/domains/shared/components/ui/Text';

export type ListOption = {
  label: string;
  value: string;
};

type SoundSelectModalProps = {
  visible: boolean;
  options: ListOption[];
  value?: string;
  onClose: () => void;
  onSelect: (value: AllSoundTypes) => void;
};

const SoundSelectModal = ({ visible, options, value, onClose, onSelect }: SoundSelectModalProps) => {
  const { playSound, stopSound } = useSoundPlayer();

  useEffect(() => {
    if (!visible) {
      stopSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!options) return null;

  return (
    <Modal visible={visible} onRequestClose={onClose}>
      <div className="flex flex-1 items-center justify-center bg-black/50" onClick={onClose}>
        <div
          className="flex w-3/4 max-w-sm flex-col rounded-2xl bg-white p-4 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  const selected = option.value as SoundType;
                  playSound(selected);
                  onSelect(selected);
                }}
                className="flex flex-row items-center rounded-xl py-3 text-left"
              >
                <span className="mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-400">
                  {isSelected && <span className="block h-3 w-3 rounded-full bg-gray-800" />}
                </span>
                <Text weight={isSelected ? 'semibold' : 'light'} className="text-lg text-gray-900">
                  {option.label}
                </Text>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default SoundSelectModal;
