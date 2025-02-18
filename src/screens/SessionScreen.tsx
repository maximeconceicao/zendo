import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from 'src/components/CustomText';
import { PALETTE } from 'src/theme/palette';

const SessionScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
      <View className="flex-1 p-10 bg-platinium">
        <CustomText className="text-4xl">Session</CustomText>
      </View>
    </SafeAreaView>
  );
};

export default SessionScreen;
