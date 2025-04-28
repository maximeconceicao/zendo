export enum InnerWeather {
  Stormy = 'stormy',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  PartlyCloudy = 'partly_cloudy',
  Sunny = 'sunny'
}

// Mapping météo -> score
export const weatherScores: Record<InnerWeather, number> = {
  [InnerWeather.Stormy]: 1,
  [InnerWeather.Rainy]: 2,
  [InnerWeather.Cloudy]: 3,
  [InnerWeather.PartlyCloudy]: 4,
  [InnerWeather.Sunny]: 5
};
