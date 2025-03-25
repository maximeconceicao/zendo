import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import ArrowButtons from 'src/components/ArrowButtons';
import PixelYear from 'src/components/PixelYear';
import { useAppData } from 'src/hooks/useAppData';
import ScreenLayout from 'src/layouts/ScreenLayout';

const PixelYearScreen = () => {
  const { meditationSessions } = useAppData();

  const [currentYear, setCurrentYear] = useState(new Date());

  const filteredSessions = useMemo(() => {
    return meditationSessions?.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate.getFullYear() === currentYear.getFullYear();
    });
  }, [meditationSessions, currentYear]);

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
        <PixelYear
          year={currentYear.getFullYear()}
          items={filteredSessions?.map((item) => ({ date: item.date, color: 'black' })) || []}
        />
      </View>
    </ScreenLayout>
  );
};

export default PixelYearScreen;
