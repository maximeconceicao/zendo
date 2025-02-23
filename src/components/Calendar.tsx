import { View, Text, Button } from 'react-native';
import React, { useMemo, useState } from 'react';
import { getCurrentMonthTitle, generateCalendar, getWeekDays } from 'src/utils/date.utils';

interface CalendarRowProps {
  week: string[];
}

const CalendarRow: React.FC<CalendarRowProps> = ({ week }) => (
  <View className="flex flex-row justify-between w-72">
    {week.map((day: string, index: number) => (
      <View key={`${day}-${index}`} className="w-8 h-8 flex justify-center items-center">
        <Text className="text-black text-sm">{day}</Text>
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

export function DashboardCalendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());

  const title: string = useMemo(() => getCurrentMonthTitle(currentDate), [currentDate]);
  const calendar: string[][] = useMemo(() => generateCalendar(currentDate), [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <View className="bg-white mt-5 pt-4 rounded-lg shadow-md">
      <View className="flex flex-row justify-between items-center mb-4">
        <Button title="<" onPress={goToPreviousMonth} />
        <Text className="text-2xl font-bold text-center">{title}</Text>
        <Button title=">" onPress={goToNextMonth} />
      </View>
      <View className="flex items-center mt-6">
        <CalendarHeader />
        {calendar.map((week: string[], index: number) => (
          <CalendarRow key={index} week={week} />
        ))}
      </View>
    </View>
  );
}
