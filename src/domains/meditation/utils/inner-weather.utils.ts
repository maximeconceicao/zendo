import { InnerWeather, weatherScores } from '../constants/inner-weather.constants';

// Mapping score -> météo
const scoreToWeather = (score: number): InnerWeather => {
  if (score < 1.5) return InnerWeather.Stormy;
  if (score < 2.5) return InnerWeather.Rainy;
  if (score < 3.5) return InnerWeather.Cloudy;
  if (score < 4.5) return InnerWeather.PartlyCloudy;
  return InnerWeather.Sunny;
};

// Fonction de calcul
export const computeDailyInnerWeather = (weathers: InnerWeather[]): InnerWeather => {
  if (weathers.length === 0) throw new Error('No weather data for the day');

  const totalScore = weathers.reduce((sum, weather) => sum + weatherScores[weather], 0);
  const averageScore = totalScore / weathers.length;

  return scoreToWeather(averageScore);
};
