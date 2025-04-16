import {
  addMonths,
  format,
  getDaysInMonth,
  isSameDay,
  isWithinInterval,
  parseISO,
  subMonths
} from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ArrowButtons from 'src/domains/shared/components/ArrowButtons';

import { Calendar } from 'src/domains/timeline/components/Calendar';
import MeditationList from 'src/domains/meditation/components/MeditationList';
import { useAppData } from 'src/store/useAppData';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import { capitalizeFirstLetter } from 'src/domains/shared/utils/common.utils';

const CalendarScreen = () => {
  const { meditationSessions } = useAppData();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const visibleSessions = useMemo(() => {
    const lastMonth = subMonths(currentMonth, 1);
    const nextMonth = addMonths(currentMonth, 1);

    const lastMonthDays = getDaysInMonth(lastMonth);

    const startOverflow = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      lastMonthDays - 5
    );
    const endOverflow = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 6);

    return (
      meditationSessions?.filter((session) => {
        const date = parseISO(session.date);
        return isWithinInterval(date, { start: startOverflow, end: endOverflow });
      }) || []
    );
  }, [meditationSessions, currentMonth]);

  const monthlySessions = useMemo(() => {
    return (
      meditationSessions
        ?.filter((session) => {
          const sessionDate = new Date(session.date);
          return (
            sessionDate.getFullYear() === currentMonth.getFullYear() &&
            sessionDate.getMonth() === currentMonth.getMonth()
          );
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []
    );
  }, [meditationSessions, currentMonth]);

  const filteredSessions = useMemo(() => {
    if (!selectedDate) {
      return monthlySessions;
    }

    return (
      meditationSessions?.filter((session) => {
        const sessionDate = new Date(session.date);
        return isSameDay(sessionDate, selectedDate);
      }) || []
    );
  }, [meditationSessions, monthlySessions, selectedDate]);

  return (
    <ScreenLayout
      title={capitalizeFirstLetter(format(currentMonth, 'MMMM', { locale: fr }))}
      subtitle={format(currentMonth, 'yyyy')}
      topRightComponent={<ArrowButtons onPrevious={goToPreviousMonth} onNext={goToNextMonth} />}
    >
      <View style={{ flex: 1 }}>
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          sessions={visibleSessions}
        />
        <View className="border-t border-gray-300 mt-9" />

        <MeditationList sessions={filteredSessions} />
        <View className="border-t border-gray-300 " />
      </View>
    </ScreenLayout>
  );
};

export default CalendarScreen;
