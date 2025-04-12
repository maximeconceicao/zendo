import React from 'react';
import { ScrollView } from 'react-native';
import HorizontalLine from 'src/components/HorizontalLine';
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

  const metricGroups = [
    { title: 'Général', data: globalMetricsData },
    { title: 'Dernier mois', data: pastMonthMetricsData },
    { title: 'Dernière année', data: pastYearMetricsData },
    { title: 'Recentrages', data: focusPointsMetricsData }
  ];

  return (
    <ScreenLayout title="Activités">
      <HorizontalLine />
      <ScrollView contentContainerStyle={{ paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {metricGroups.map(({ title, data }) => (
          <MetricGroup key={title} title={title} data={data} />
        ))}
      </ScrollView>
      <HorizontalLine />
    </ScreenLayout>
  );
};

export default ActivityScreen;
