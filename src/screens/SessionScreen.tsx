import React from 'react';
import { Button, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from 'src/components/CustomText';
import useSessionTimer from 'src/hooks/useSessionTimer';
import { PALETTE } from 'src/theme/palette';

const SessionScreen = () => {
  const { timeLeft, isRunning, start, pause, reset } = useSessionTimer(60);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
      <View className="flex-1 p-10 bg-platinium">
        <CustomText className="text-4xl">Session</CustomText>
        <View className="flex-1 justify-center items-center">
          <CustomText className="text-5xl font-bold text-gray-800 mb-6">{timeLeft}s</CustomText>
          <View className="flex-row gap-4">
            <Button title="Start" onPress={start} disabled={isRunning} />
            <Button title="Pause" onPress={pause} disabled={!isRunning} />
            <Button title="Reset" onPress={reset} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SessionScreen;
