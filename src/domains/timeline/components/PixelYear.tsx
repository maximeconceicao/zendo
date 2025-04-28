import React from 'react';
import { View } from 'react-native';
import CustomText from 'src/domains/shared/components/CustomText';
import { isSameDay } from 'date-fns';
import { WeatherIcon } from 'src/domains/shared/components/WeatherIcon';
import { InnerWeather } from 'src/domains/meditation/constants/inner-weather.constants';
import { PALETTE } from 'src/theme/palette';

const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
const monthLetters = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const PixelYear = ({
  year,
  items
}: {
  year: number;
  items: { date: string; color: string; weather: InnerWeather }[];
}) => {
  const grid = Array.from({ length: 12 }, (_, month) =>
    Array.from({ length: 31 }, (_, day) => {
      const daysInCurrentMonth = daysInMonth(year, month + 1);
      const isOutOfMonth = day + 1 > daysInCurrentMonth;
      const currentDate = new Date(year, month, day + 1);
      const item = items.find((item) => isSameDay(new Date(item.date), currentDate));

      return {
        color: isOutOfMonth ? 'transparent' : item ? item.color : 'transparent',
        weather: item?.weather,
        isOutOfMonth
      };
    })
  );

  return (
    <View className="flex-row flex-wrap justify-center">
      {grid.map((month, monthIndex) => (
        <View key={monthIndex} className="items-center">
          <CustomText className="text-center text-sm">{monthLetters[monthIndex]}</CustomText>
          {month.map((cell, dayIndex) => {
            const isFirstColumn = monthIndex === 0;
            const isFirstRow = dayIndex === 0;
            return (
              <View key={dayIndex} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isFirstColumn && (
                  <CustomText className="absolute -left-6 w-6 text-center text-sm">
                    {dayIndex + 1}
                  </CustomText>
                )}
                <View
                  className={`
                    w-[1.25rem] h-[1.25rem] border-black items-center justify-center
                    ${cell.isOutOfMonth ? '' : 'border-b'} 
                    border-r 
                    ${isFirstRow ? 'border-t' : ''} 
                    ${isFirstColumn ? 'border-l' : ''}
                  `}
                  style={{ backgroundColor: cell.color }}
                >
                  {cell.weather && (
                    <WeatherIcon
                      size={12}
                      weather={cell.weather}
                      color={PALETTE.background.light}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default PixelYear;
