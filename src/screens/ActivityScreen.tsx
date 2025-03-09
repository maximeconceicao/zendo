import React from 'react';
import MetricGroup from 'src/components/MetricGroup';
import useMeditationMetrics from 'src/hooks/useMeditationMetrics';
import ScreenLayout from 'src/layouts/ScreenLayout';
import { MeditationSession } from 'src/types/storage.types';
import { formatGlobalMetrics } from 'src/utils/activity.utils';

const sessions: MeditationSession[] = [
  {
    id: '1',
    date: '2025-03-01T10:00:00.000Z',
    plannedDurationSeconds: 1800,
    actualDurationSeconds: 1500,
    focusPoints: [{ elapsedTime: 300 }, { elapsedTime: 1200 }]
  },
  {
    id: '2',
    date: '2025-03-02T10:00:00.000Z',
    plannedDurationSeconds: 1800,
    actualDurationSeconds: 1800,
    focusPoints: [{ elapsedTime: 900 }, { elapsedTime: 1800 }]
  }
];

const ActivityScreen = () => {
  const globalMetrics = useMeditationMetrics(sessions);
  const globalMetricsData = formatGlobalMetrics(globalMetrics);

  return (
    <ScreenLayout title="Activités">
      <MetricGroup title="Général" data={globalMetricsData} />
    </ScreenLayout>
  );
};

export default ActivityScreen;
