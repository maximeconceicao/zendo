import React from 'react';
import { View } from 'react-native';
import CustomText from 'src/components/CustomText';
import { verifyInstallation } from 'nativewind';
import { DashboardCalendar } from 'src/components/Calendar';

const ActivityScreen = () => {
  verifyInstallation();
  return (
    <View className="h-full p-10 bg-platinium">
      <CustomText className="text-3xl">Activity</CustomText>
      <DashboardCalendar />
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f8f9fa'
//   },
//   text: {
//     fontSize: 20,
//     color: '#333'
//   }
// });

export default ActivityScreen;
