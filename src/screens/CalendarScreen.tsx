import React from 'react';
import { View } from 'react-native';
import { verifyInstallation } from 'nativewind';
import { Calendar } from 'src/components/Calendar';

const CalendarScreen = () => {
  verifyInstallation();
  return (
    <View className="h-full p-10 bg-platinium">
      <Calendar />
      <View className="border-t border-black mt-9" />
    </View>
  );
};

export default CalendarScreen;
