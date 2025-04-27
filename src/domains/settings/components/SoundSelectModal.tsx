import React, { useEffect } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { AllSoundTypes, SoundType } from 'src/domains/shared/constants/common.constants';
import { useSoundPlayer } from 'src/domains/shared/hooks/useSoundPlayer';
import CustomText from 'src/domains/shared/components/CustomText';

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

const SoundSelectModal = ({
  visible,
  options,
  value,
  onClose,
  onSelect
}: SoundSelectModalProps) => {
  const { playSound, stopSound } = useSoundPlayer();

  useEffect(() => {
    if (!visible) {
      stopSound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!options) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-3/4 p-4 rounded-2xl shadow-lg">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    const selected = option.value as SoundType;
                    playSound(selected);
                    onSelect(selected);
                  }}
                  className="py-3 rounded-xl"
                  activeOpacity={0.6}
                >
                  <View className="flex-row items-center">
                    <View className="w-5 h-5 rounded-full border-2 border-gray-400 items-center justify-center mr-3">
                      {isSelected && <View className="w-3 h-3 rounded-full bg-gray-800" />}
                    </View>
                    <CustomText
                      className={`text-lg text-gray-900 ${isSelected ? 'font-bold' : ''}`}
                    >
                      {option.label}
                    </CustomText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SoundSelectModal;
