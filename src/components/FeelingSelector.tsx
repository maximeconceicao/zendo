import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import CustomText from 'src/components/CustomText';
import { Smile, Meh, Frown } from 'lucide-react-native';
import { MeditationFeeling } from 'src/constants/session.constants';
import { PALETTE } from 'src/theme/palette';

interface FeelingSelectorProps {
  selectedFeeling: MeditationFeeling | null;
  onSelect: (feeling: MeditationFeeling) => void;
}

// Mapping des icônes et couleurs associées aux valeurs de l'énum
const feelingOptions: { feeling: MeditationFeeling; Icon: any }[] = [
  { feeling: MeditationFeeling.Bad, Icon: Frown },
  { feeling: MeditationFeeling.Neutral, Icon: Meh },
  { feeling: MeditationFeeling.Good, Icon: Smile }
];

const FeelingSelector: React.FC<FeelingSelectorProps> = ({ selectedFeeling, onSelect }) => {
  return (
    <View className="my-3">
      <CustomText className="text-lg text-center mb-4">Comment vous sentez-vous ?</CustomText>
      <View className="flex-row justify-center space-x-6">
        {feelingOptions.map(({ feeling, Icon }) => (
          <TouchableOpacity key={feeling} onPress={() => onSelect(feeling)} className="mx-2">
            <Icon
              size={40}
              color={selectedFeeling === feeling ? PALETTE.neutral.black : PALETTE.neutral.gray}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FeelingSelector;
