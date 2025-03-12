import { format } from 'date-fns';
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

  const mockSessions: MeditationSession[] = [
    {
      id: '1',
      date: new Date('2025-03-03').toISOString(),
      actualDurationSeconds: 10,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '2',
      date: new Date('2025-03-01').toISOString(),
      actualDurationSeconds: 20,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '3',
      date: new Date().toISOString(),
      actualDurationSeconds: 30,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '4',
      date: new Date().toISOString(),
      actualDurationSeconds: 40,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '5',
      date: new Date().toISOString(),
      actualDurationSeconds: 50,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '6',
      date: new Date().toISOString(),
      actualDurationSeconds: 60,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '7',
      date: new Date().toISOString(),
      actualDurationSeconds: 70,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '8',
      date: new Date().toISOString(),
      actualDurationSeconds: 80,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '9',
      date: new Date().toISOString(),
      actualDurationSeconds: 90,
      focusPoints: [],
      planneDurationSeconds: 10
    },
    {
      id: '10',
      date: new Date().toISOString(),
      actualDurationSeconds: 100,
      focusPoints: [],
      planneDurationSeconds: 10
    }
  ];

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
          sessions={mockSessions}
        />
        <View className="border-t border-black mt-9" />
        <MeditationList sessions={mockSessions || []} />
        {/* <MonthlyMeditationStats sessions={sessions || []} /> */}
      </View>
    </ScreenLayout>
  );
};

export default CalendarScreen;
