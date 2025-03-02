import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import CustomText from 'src/components/CustomText';
import ScreenName from 'src/constants/screenNames';
import { PALETTE } from 'src/theme/palette';

const HomeScreen = ({ navigation }) => {
  const [sliderValue, setSliderValue] = useState(20);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
      <View className="flex-1 p-10 bg-platinium">
        <CustomText className="text-4xl">Meditation Diary</CustomText>

        <View className="flex-1 justify-end">
          <CustomText className="text-lg text-center">Durée: {sliderValue} minutes</CustomText>
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

        <View className="p-10">
          <TouchableOpacity
            className="bg-black p-4 rounded-lg"
            onPress={() =>
              navigation.navigate(ScreenName.MEDITATION_TIMER, {
                durationSeconds: sliderValue * 60
              })
            }
          >
            <CustomText className="text-white text-center text-lg">
              Démarrer la méditation
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
