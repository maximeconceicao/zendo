import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import CustomText from 'src/components/CustomText';
import ScreenName from 'src/constants/screenNames';
import { PALETTE } from 'src/theme/palette';
import DailyQuote from 'src/components/DailyQuote';
import { MeditationQuote } from 'src/types/storage.types';
import ScreenLayout from 'src/layouts/ScreenLayout';

const meditationQuotes: MeditationQuote[] = [
  { quote: 'Le calme est la clé de la maîtrise.', author: 'James Allen' },
  { quote: 'Là où est ton attention, là est ton énergie.', author: 'Joe Dispenza' },
  {
    quote:
      'Apprendre à méditer est le plus grand don que vous puissiez vous accorder dans cette vie. En effet, seule la méditation vous permettra de partir à la découverte de votre vraie nature et de trouver ainsi la stabilité et l’assurance nécessaire pour vivre bien et mourir bien.',
    author: 'Sogyal Rinpoché'
  }
];

const HomeScreen = ({ navigation }) => {
  const [sliderValue, setSliderValue] = useState(20);

  return (
    <ScreenLayout title="Carnet de Méditation">
      <View className="flex-1 justify-center">
        <DailyQuote quotes={meditationQuotes} />
      </View>

      <View className="justify-end">
        <CustomText className="text-base text-center">Durée: {sliderValue} minutes</CustomText>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={90}
          step={1}
          value={sliderValue}
          onValueChange={setSliderValue}
          minimumTrackTintColor={PALETTE.neutral.black}
          maximumTrackTintColor="#000000"
          thumbTintColor={PALETTE.neutral.black}
        />
      </View>

      <View className="p-9">
        <TouchableOpacity
          className="bg-black p-4 rounded-lg"
          onPress={() =>
            navigation.navigate(ScreenName.MEDITATION_TIMER, {
              durationSeconds: sliderValue * 60
            })
          }
        >
          <CustomText className="text-white text-center text-lg">Démarrer la méditation</CustomText>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
};

export default HomeScreen;
