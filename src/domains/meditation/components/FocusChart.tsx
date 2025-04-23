import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
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
  const focusPointsPerMinute: number[] = Array(durationMinutes).fill(0);
  focusPoints.forEach((fp) => {
    const minute = Math.floor(fp.elapsedTime / 60);
    if (minute < durationMinutes) {
      focusPointsPerMinute[minute] += 1;
    }
  });

  const maxFocusPerMinute = Math.max(...focusPointsPerMinute);

  const chartData = {
    labels: focusPointsPerMinute.map((_, i) => `${i}`),
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
      <ScrollView horizontal>
        <LineChart
          data={chartData}
          segments={maxFocusPerMinute}
          width={durationMinutes < 10 ? screenWidth : durationMinutes * 25}
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
      </ScrollView>
    </View>
  );
};

export default FocusChart;
