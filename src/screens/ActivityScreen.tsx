import { verifyInstallation } from 'nativewind';
import React from 'react';
import { View } from 'react-native';
import CustomText from 'src/components/CustomText';

const ActivityScreen = () => {
  verifyInstallation();
  return (
    <View className="h-full p-10 bg-platinium">
      <CustomText className="text-3xl">Activity</CustomText>
    </View>
  );
};

export default ActivityScreen;
