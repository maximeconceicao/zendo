import React from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import CustomText from 'src/components/CustomText';
import ScreenName from 'src/constants/screenNames';
import { PALETTE } from 'src/theme/palette';
import { MeditationSession } from 'src/types/storage.types';

const screenWidth = Dimensions.get('window').width;

const MeditationSummaryScreen = ({ navigation, route }) => {
  const { meditationSession }: { meditationSession: MeditationSession } = route.params || {
    meditationSession: {}
  };

  const focusPoints = meditationSession.focusPoints || [];
  const durationSeconds = meditationSession.actualDurationSeconds || 0;
  const durationMinutes = Math.ceil(durationSeconds / 60);

  const durationDisplay =
    durationSeconds < 60
      ? `${durationSeconds} seconds`
      : `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;

  // Regroupement des focus points par minute avec valeurs par défaut
  const focusPointsPerMinute = Array(durationMinutes).fill(0);
  focusPoints.forEach((fp) => {
    const minute = Math.floor(fp.elapsedTime / 60);
    if (minute < durationMinutes) {
      focusPointsPerMinute[minute] += 1;
    }
  });

  const chartData = {
    labels: focusPointsPerMinute.map((_, i) => `${i}m`),
    datasets: [
      {
        data: focusPointsPerMinute,
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2
      }
    ]
  };

  const maxFocusPoints = Math.max(...focusPointsPerMinute, 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: PALETTE.background.light }}>
      <View className="flex-1 p-6 bg-platinium">
        <CustomText className="text-4xl">Summary</CustomText>

        <View className="my-10">
          <CustomText className="text-lg text-center">Duration:</CustomText>
          <CustomText className="text-4xl font-semibold text-center">{durationDisplay}</CustomText>
        </View>

        <View className="mb-6">
          <CustomText className="text-lg text-center">Focus Points:</CustomText>
          <CustomText className="text-4xl font-semibold text-center">
            {focusPoints.length}
          </CustomText>
        </View>

        {focusPoints.length > 0 && (
          <View className="mb-6">
            <CustomText className="text-lg text-center mb-14">Focus Points Per Minute</CustomText>
            <LineChart
              data={chartData}
              width={screenWidth * 0.9}
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // Assure une échelle régulière
              chartConfig={{
                backgroundColor: '#f5f5f5',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '4', strokeWidth: '2', stroke: '#007AFF' }
              }}
              bezier
              style={{ borderRadius: 16, alignSelf: 'center' }}
              fromZero={true} // Débute l'axe Y à 0
              yAxisMin={0}
              yAxisMax={maxFocusPoints} // Ajuste l'axe Y au max des focus points
            />
          </View>
        )}

        <View className="p-6 flex-1 justify-end">
          <TouchableOpacity
            className="bg-black p-4 rounded-lg"
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: ScreenName.MAIN_TABS }]
              })
            }
          >
            <CustomText className="text-white text-center text-lg">OK</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MeditationSummaryScreen;
