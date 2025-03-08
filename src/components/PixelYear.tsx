import React from 'react';
import { View } from 'react-native';
import CustomText from './CustomText';

const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();
const monthLetters = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const PixelYear = ({ year, items }: { year: number; items: { date: string; color: string }[] }) => {
  const grid = Array.from({ length: 12 }, (_, month) =>
    Array.from({ length: 31 }, (_, day) => {
      const daysInCurrentMonth = daysInMonth(year, month + 1);
      const isOutOfMonth = day + 1 > daysInCurrentMonth;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
      const item = items.find((item) => item.date === dateStr);
      return {
        color: isOutOfMonth ? 'transparent' : item ? item.color : 'transparent',
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
                    w-[1.375rem] h-[1.375rem] border-black 
                    ${cell.isOutOfMonth ? '' : 'border-b'} 
                    border-r 
                    ${isFirstRow ? 'border-t' : ''} 
                    ${isFirstColumn ? 'border-l' : ''}
                  `}
                  style={{ backgroundColor: cell.color }}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default PixelYear;
