import { isSameMonth, isToday, startOfMonth } from 'date-fns';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MeditationSession } from 'src/data/storage.types';
import { CalendarDay, generateCalendar, getWeekDays } from 'src/domains/shared/utils/date.utils';
import CustomText from '../../shared/components/CustomText';

interface CalendarRowProps {
  week: CalendarDay[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  sessions: MeditationSession[];
}

const CalendarRow: React.FC<CalendarRowProps> = ({
  week,
  selectedDate,
  onSelectDate,
  sessions
}) => (
  <View className="flex flex-row justify-between w-72">
    {week.map(({ day, isCurrentMonth, date }, index) => {
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const today = isToday(date);
      const hasSession = sessions.some(
        (session) => new Date(session.date).toDateString() === date.toDateString()
      );

      const textColor = isSelected ? 'text-white' : isCurrentMonth ? 'text-black' : 'text-gray-400';

      return (
        <TouchableOpacity
          key={`${day}-${index}`}
          className="w-8 h-8 flex justify-center items-center"
          onPress={() => onSelectDate(date)}
        >
          <View
            className={`w-7 h-7 rounded-full flex items-center justify-center ${
              isSelected ? 'bg-black' : today ? 'border border-black' : ''
            }`}
          >
            <CustomText className={`${textColor} text-sm`}>{day}</CustomText>
          </View>
          {hasSession && (
            <View
              className={`absolute  rounded-full ${isCurrentMonth ? 'bg-black' : 'bg-gray-400'}`}
              style={{ width: 3.5, height: 3.5, bottom: 0.5 }}
            />
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

const CalendarHeader: React.FC = () => {
  const weekDays = getWeekDays();
  return (
    <View className="flex flex-row justify-between w-72">
      {weekDays.map((day, index) => (
        <View key={index} className="w-8 h-8 flex justify-center items-center">
          <CustomText className="text-gray-400 text-xs">{day}</CustomText>
        </View>
      ))}
    </View>
  );
};

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  sessions: MeditationSession[];
}

export function Calendar({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  sessions
}: CalendarProps): JSX.Element {
  const calendar: CalendarDay[][] = useMemo(() => generateCalendar(currentMonth), [currentMonth]);

  const handleSelectDate = (date: Date) => {
    if (!isSameMonth(date, currentMonth)) {
      setCurrentMonth(startOfMonth(date));
    }

    setSelectedDate((prev) => (prev && prev.toDateString() === date.toDateString() ? null : date));
  };

  return (
    <View>
      <View className="flex items-center mt-3">
        <CalendarHeader />
        {calendar.map((week: CalendarDay[], index: number) => (
          <CalendarRow
            key={index}
            week={week}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            sessions={sessions}
          />
        ))}
      </View>
    </View>
  );
}
