import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CalendarDay, generateCalendar, getWeekDays } from 'src/utils/date.utils';
import CustomText from './CustomText';

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
          <CustomText className="text-black text-base">{day}</CustomText>
        </View>
      ))}
    </View>
  );
};

export function Calendar(): JSX.Element {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendar: CalendarDay[][] = useMemo(() => generateCalendar(currentDate), [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  return (
    <View>
      <View className="flex flex-row justify-between items-center mb-2">
        <View>
          <CustomText className="text-4xl mb-1">{format(currentDate, 'MMMM')}</CustomText>
          <CustomText className="text-base">{format(currentDate, 'yyyy')}</CustomText>
        </View>

        <View className="flex flex-row">
          <TouchableOpacity
            onPress={goToPreviousMonth}
            className="bg-black w-9 h-9 rounded-full mr-3 flex items-center justify-center"
          >
            <ChevronLeft stroke={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goToNextMonth}
            className="bg-black w-9 h-9 rounded-full flex items-center justify-center"
          >
            <ChevronRight stroke={'white'} />
          </TouchableOpacity>
        </View>
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
