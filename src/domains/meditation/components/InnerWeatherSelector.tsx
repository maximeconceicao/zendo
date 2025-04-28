import { Cloud, CloudLightning, CloudRain, CloudSun, Sun } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import CustomText from 'src/domains/shared/components/CustomText';
import { PALETTE } from 'src/theme/palette';
import { InnerWeather } from '../constants/inner-weather.constants';

interface InnerWeatherProps {
  selectedInnerWeather: InnerWeather | null;
  onSelect: (weather: InnerWeather) => void;
}

const innerWeatherOptions: { weather: InnerWeather; Icon: any }[] = [
  { weather: InnerWeather.Stormy, Icon: CloudLightning },
  { weather: InnerWeather.Rainy, Icon: CloudRain },
  { weather: InnerWeather.Cloudy, Icon: Cloud },
  { weather: InnerWeather.PartlyCloudy, Icon: CloudSun },
  { weather: InnerWeather.Sunny, Icon: Sun }
];

const InnerWeatherSelector: React.FC<InnerWeatherProps> = ({ selectedInnerWeather, onSelect }) => {
  return (
    <View className="my-3">
      <CustomText className="text-lg text-center mb-4">
        Quelle était votre météo intérieure ?
      </CustomText>
      <View className="flex-row justify-center space-x-6">
        {innerWeatherOptions.map(({ weather, Icon }) => (
          <TouchableOpacity key={weather} onPress={() => onSelect(weather)} className="mx-2">
            <Icon
              size={40}
              color={
                selectedInnerWeather === weather ? PALETTE.neutral.black : PALETTE.neutral.gray
              }
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default InnerWeatherSelector;
