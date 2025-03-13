import { format, isSameDay } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ArrowButtons from 'src/components/ArrowButtons';
import { fr } from 'date-fns/locale';

import { Calendar } from 'src/components/Calendar';
import MeditationList from 'src/components/MeditationList';
import MonthlyMeditationStats from 'src/components/MeditationStats';
import ScreenLayout from 'src/layouts/ScreenLayout';
import { getMeditationSessions } from 'src/utils/storage';
import { capitalizeFirstLetter } from 'src/utils/common.utils';

const CalendarScreen = () => {
  const sessions = useMemo(() => getMeditationSessions(), []);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const monthlySessions = useMemo(() => {
    return (
      sessions
        ?.filter((session) => {
          const sessionDate = new Date(session.date);
          return (
            sessionDate.getFullYear() === currentMonth.getFullYear() &&
            sessionDate.getMonth() === currentMonth.getMonth()
          );
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []
    );
  }, [sessions, currentMonth]);

  const filteredSessions = useMemo(() => {
    if (!selectedDate) {
      return monthlySessions;
    }

    return (
      sessions?.filter((session) => {
        const sessionDate = new Date(session.date);
        return isSameDay(sessionDate, selectedDate);
      }) || []
    );
  }, [sessions, monthlySessions, selectedDate]);

  return (
    <ScreenLayout
      title={capitalizeFirstLetter(format(currentMonth, 'MMMM', { locale: fr }))}
      subtitle={format(currentMonth, 'yyyy')}
      topRightComponent={<ArrowButtons onPrevious={goToPreviousMonth} onNext={goToNextMonth} />}
    >
      <View>
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          sessions={monthlySessions}
        />
        <View className="border-t border-black mt-9" />
        <MeditationList sessions={filteredSessions} />
        {/* <MonthlyMeditationStats sessions={sessions || []} /> */}
      </View>
    </ScreenLayout>
  );
};

export default CalendarScreen;
