import { format } from 'date-fns';
import React, { useState } from 'react';
import { View } from 'react-native';
import ArrowButtons from 'src/components/ArrowButtons';
import PixelYear from 'src/components/PixelYear';
import ScreenLayout from 'src/layouts/ScreenLayout';

const PixelYearScreen = () => {
  const [currentYear, setCurrentYear] = useState(new Date());

  const goToPreviousYear = () => {
    setCurrentYear((prevDate) => new Date(prevDate.setFullYear(prevDate.getFullYear() - 1)));
  };

  const goToNextYear = () => {
    setCurrentYear((prevDate) => new Date(prevDate.setFullYear(prevDate.getFullYear() + 1)));
  };

  return (
    <ScreenLayout
      title={format(currentYear, 'yyyy')}
      topRightComponent={<ArrowButtons onPrevious={goToPreviousYear} onNext={goToNextYear} />}
    >
      <View className="h-full justify-center">
        <PixelYear
          year={currentYear.getFullYear()}
          items={[{ date: '2023-01-01', color: 'grey' }]}
        />
      </View>
    </ScreenLayout>
  );
};

export default PixelYearScreen;
