import { View, Text, Button } from 'react-native';
import React, { useMemo, useState } from 'react';
import {
  getCurrentMonthTitle,
  generateCalendar,
  getWeekDays,
  CalendarDay
} from 'src/utils/date.utils';

interface CalendarRowProps {
  week: { day: number; isCurrentMonth: boolean }[];
}

const CalendarRow: React.FC<CalendarRowProps> = ({ week }) => (
  <View className="flex flex-row justify-between w-72">
    {week.map(({ day, isCurrentMonth }, index) => (
      <View key={`${day}-${index}`} className="w-8 h-8 flex justify-center items-center">
        <Text className={isCurrentMonth ? 'text-black text-sm' : 'text-gray-400 text-sm'}>
          {day}
        </Text>
      </View>
    ))}
  </View>
);

const CalendarHeader: React.FC = () => {
  const weekDays = getWeekDays();
  return (
    <View className="flex flex-row justify-between w-72">
      {weekDays.map((day, index) => (
        <View key={index} className="w-8 h-8 flex justify-center items-center">
          <Text className="text-black text-sm font-bold">{day}</Text>
        </View>
      ))}
    </View>
  );
};

export function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());

  const title: string = useMemo(() => getCurrentMonthTitle(currentDate), [currentDate]);
  const calendar: CalendarDay[][] = useMemo(() => generateCalendar(currentDate), [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <View>
      <View className="flex flex-row justify-between items-center mb-4">
        <Button title="<" onPress={goToPreviousMonth} />
        <Text className="text-xl font-bold text-center">{title}</Text>
        <Button title=">" onPress={goToNextMonth} />
      </View>
      <View className="flex items-center mt-3">
        <CalendarHeader />
        {calendar.map((week: CalendarDay[], index: number) => (
          <CalendarRow key={index} week={week} />
        ))}
      </View>
    </View>
  );
}
