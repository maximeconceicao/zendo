import React from 'react';
import { ScrollView } from 'react-native';
import HorizontalLine from 'src/domains/shared/components/HorizontalLine';
import { useAppData } from 'src/store/useAppData';
import useMeditationMetrics from 'src/domains/activity/hooks/useMeditationMetrics';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import {
  formatMeditationMetrics,
  getFocusPointsMetricData,
  getLast30DaysSessions,
  getLast365DaysSessions
} from 'src/domains/activity/activity.utils';
import MetricGroup from '../components/MetricGroup';

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

  const focusPointsMetricsData = getFocusPointsMetricData(sessions);

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
