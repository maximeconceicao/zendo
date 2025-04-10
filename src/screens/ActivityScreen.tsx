import React from 'react';
import { View } from 'react-native';
import MetricGroup from 'src/components/MetricGroup';
import { useAppData } from 'src/hooks/useAppData';
import useMeditationMetrics from 'src/hooks/useMeditationMetrics';
import ScreenLayout from 'src/layouts/ScreenLayout';
import {
  formatMeditationMetrics,
  getLast30DaysSessions,
  getLast365DaysSessions,
  MetricData
} from 'src/utils/activity.utils';

const ActivityScreen = () => {
  const { meditationSessions } = useAppData();

  const sessions = meditationSessions ?? [];

  const last30DaysSessions = getLast30DaysSessions(sessions);
  const last365DaysSessions = getLast365DaysSessions(sessions);

  const globalMetrics = useMeditationMetrics(sessions);
  const pastMonthMetrics = useMeditationMetrics(last30DaysSessions, [
    'currentConsecutiveDays',
    'longestConsecutiveDays',
    'longestSessionMinutes'
  ]);
  const pastYearMetrics = useMeditationMetrics(last365DaysSessions, [
    'currentConsecutiveDays',
    'longestConsecutiveDays',
    'longestSessionMinutes'
  ]);

  const globalMetricsData = formatMeditationMetrics(globalMetrics);
  const pastMonthMetricsData = formatMeditationMetrics(pastMonthMetrics);
  const pastYearMetricsData = formatMeditationMetrics(pastYearMetrics);

  const focusPointsMetricsData = [] as MetricData[];

  return (
    <ScreenLayout title="Activités">
      <View className="mt-4 flex-1">
        <MetricGroup title="Général" data={globalMetricsData} />
        <MetricGroup title="Dernier mois" data={pastMonthMetricsData} />
        <MetricGroup title="Dernière année" data={pastYearMetricsData} />
        <MetricGroup title="Recentrages" data={focusPointsMetricsData} />
      </View>
    </ScreenLayout>
  );
};

export default ActivityScreen;
