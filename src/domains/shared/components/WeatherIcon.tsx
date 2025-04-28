import { InnerWeather } from 'src/domains/meditation/constants/inner-weather.constants';
import { Cloud, CloudLightning, CloudRain, CloudSun, Sun } from 'lucide-react-native';

const weatherIcons = {
  [InnerWeather.Stormy]: CloudLightning,
  [InnerWeather.Rainy]: CloudRain,
  [InnerWeather.Cloudy]: Cloud,
  [InnerWeather.PartlyCloudy]: CloudSun,
  [InnerWeather.Sunny]: Sun
};
export const WeatherIcon = ({
  weather,
  size,
  color = 'black'
}: {
  weather: InnerWeather;
  size: number;
  color?: string;
}) => {
  const Icon = weatherIcons[weather];
  return <Icon size={size} color={color} />;
};
