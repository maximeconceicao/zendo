import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ArrowButtons from 'src/domains/shared/components/ArrowButtons';
import PixelYear from 'src/domains/timeline/components/PixelYear';
import { useAppData } from 'src/store/useAppData';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import { InnerWeather } from 'src/domains/meditation/constants/inner-weather.constants';
import { computeDailyInnerWeather } from 'src/domains/meditation/utils/inner-weather.utils';

const PixelYearScreen = () => {
  const { meditationSessions } = useAppData();

  const [currentYear, setCurrentYear] = useState(new Date());

  const filteredSessions = useMemo(() => {
    return meditationSessions?.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.getFullYear() === currentYear.getFullYear();
    });
  }, [meditationSessions, currentYear]);

  const sessionsGroupedByDay = useMemo(() => {
    const grouped: Record<string, { date: string; weathers: InnerWeather[] }> = {};

    filteredSessions?.forEach((session) => {
      const day = format(new Date(session.date), 'yyyy-MM-dd');
      if (!grouped[day]) {
        grouped[day] = { date: day, weathers: [] };
      }
      if (session.innerWeather) {
        grouped[day].weathers.push(session.innerWeather);
      }
    });

    return grouped;
  }, [filteredSessions]);

  const items = useMemo(() => {
    return Object.values(sessionsGroupedByDay).map((group) => ({
      date: group.date,
      color: 'black',
      weather: computeDailyInnerWeather(group.weathers)
    }));
  }, [sessionsGroupedByDay]);

  const earliestYear = useMemo(() => {
    if (!meditationSessions || meditationSessions.length === 0) return null;
    return Math.min(...meditationSessions.map((session) => new Date(session.date).getFullYear()));
  }, [meditationSessions]);

  const goToPreviousYear = () => {
    setCurrentYear((prevDate) => new Date(prevDate.setFullYear(prevDate.getFullYear() - 1)));
  };

  const goToNextYear = () => {
    setCurrentYear((prevDate) => new Date(prevDate.setFullYear(prevDate.getFullYear() + 1)));
  };

  return (
    <ScreenLayout
      title={format(currentYear, 'yyyy')}
      topRightComponent={
        <ArrowButtons
          onPrevious={goToPreviousYear}
          onNext={goToNextYear}
          disablePrevious={currentYear.getFullYear() === earliestYear}
        />
      }
    >
      <View className="h-full justify-center">
        <PixelYear year={currentYear.getFullYear()} items={items} />
      </View>
    </ScreenLayout>
  );
};

export default PixelYearScreen;
