import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface ArrowButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  disablePrevious?: boolean;
}

const ArrowButtons: React.FC<ArrowButtonsProps> = ({
  onPrevious,
  onNext,
  disablePrevious = false
}) => {
  return (
    <View className="flex flex-row">
      <TouchableOpacity
        disabled={disablePrevious}
        onPress={onPrevious}
        className={`w-9 h-9 rounded-full mr-3 flex items-center justify-center ${
          disablePrevious ? 'bg-gray-400' : 'bg-black'
        }`}
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
