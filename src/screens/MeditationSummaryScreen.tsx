import React, { useState } from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CustomText from 'src/components/CustomText';
import ScreenName from 'src/constants/screenNames';
import { PALETTE } from 'src/theme/palette';
import { MeditationSession } from 'src/types/storage.types';
import { MeditationFeeling } from 'src/constants/session.constants';
import FeelingSelector from 'src/components/FeelingSelector';
import ScreenLayout from 'src/layouts/ScreenLayout';

const screenWidth = Dimensions.get('window').width;

const MeditationSummaryScreen = ({ navigation, route }) => {
  const { meditationSession }: { meditationSession: MeditationSession } = route.params || {
    meditationSession: {}
  };

  const [selectedFeeling, setSelectedFeeling] = useState<MeditationFeeling>(
    MeditationFeeling.Neutral
  );

  const focusPoints = meditationSession.focusPoints || [];
  const durationSeconds = meditationSession.actualDurationSeconds || 0;
  const durationMinutes = Math.ceil(durationSeconds / 60);

  const durationDisplay =
    durationSeconds < 60
      ? `${durationSeconds} secondes`
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

  return (
    <ScreenLayout title="Résumé">
      <View className="my-4">
        <CustomText className="text-lg text-center">Durée :</CustomText>
        <CustomText className="text-4xl font-semibold text-center">{durationDisplay}</CustomText>
      </View>

      <View className="my-4">
        <CustomText className="text-lg text-center">Recentrages :</CustomText>
        <CustomText className="text-4xl font-semibold text-center">{focusPoints.length}</CustomText>
      </View>

      {focusPoints.length > 0 && (
        <View className="my-2">
          <CustomText className="text-lg text-center mb-5">Recentrages par minute :</CustomText>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: PALETTE.background.light,
              backgroundGradientFrom: PALETTE.background.light,
              backgroundGradientTo: PALETTE.background.light,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', fill: '#000' }
            }}
            bezier
            style={{ borderRadius: 16, alignSelf: 'center' }}
            fromZero={true}
          />
        </View>
      )}

      <FeelingSelector selectedFeeling={selectedFeeling} onSelect={setSelectedFeeling} />

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
    </ScreenLayout>
  );
};

export default MeditationSummaryScreen;
