import React from 'react';
import { View } from 'react-native';
import CustomText from 'src/components/CustomText';
import { verifyInstallation } from 'nativewind';
import { DashboardCalendar } from 'src/components/Calendar';

const CalendarScreen = () => {
  verifyInstallation();
  return (
    <View className="h-full p-10 bg-platinium">
      <DashboardCalendar />
    </View>
  );
};

export default CalendarScreen;
