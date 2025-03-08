import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface ArrowButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
}

const ArrowButtons: React.FC<ArrowButtonsProps> = ({ onPrevious, onNext }) => {
  return (
    <View className="flex flex-row">
      <TouchableOpacity
        onPress={onPrevious}
        className="bg-black w-9 h-9 rounded-full mr-3 flex items-center justify-center"
      >
        <ChevronLeft stroke={'white'} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onNext}
        className="bg-black w-9 h-9 rounded-full flex items-center justify-center"
      >
        <ChevronRight stroke={'white'} />
      </TouchableOpacity>
    </View>
  );
};

export default ArrowButtons;
