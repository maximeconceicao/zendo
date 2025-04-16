import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import CustomText from 'src/domains/shared/components/CustomText';
import { PALETTE } from 'src/theme/palette';
import { FocusPoint } from 'src/data/storage.types';

const screenWidth = Dimensions.get('window').width;

const FocusChart = ({
  focusPoints,
  durationMinutes
}: {
  focusPoints: FocusPoint[];
  durationMinutes: number;
}) => {
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
    <View className="my-2">
      <CustomText className="text-lg text-center mb-4">Recentrages par minute :</CustomText>
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
  );
};

export default FocusChart;
