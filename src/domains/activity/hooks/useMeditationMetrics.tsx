import { useMemo } from 'react';
import { MeditationMetrics } from 'src/domains/activity/activity.types';
import { MeditationSession } from 'src/data/storage.types';
import {
  calculateTotalMeditationTime,
  calculateCurrentConsecutiveDays,
  calculateLongestSessionMinutes,
  calculateAverageWeeklyMeditationDuration,
  calculateAverageSessionDurationMinutes,
  calculateAverageSessionDurationOffset,
  calculateLongestConsecutiveDays
} from 'src/domains/activity/activity.utils';

const useMeditationMetrics = (
  sessions: MeditationSession[],
  excludedMetrics: (keyof MeditationMetrics)[] = []
): Partial<MeditationMetrics> => {
  return useMemo(() => {
    const metrics: MeditationMetrics = {
      totalSessions: sessions.length,
      totalMeditatedTimeSpent: calculateTotalMeditationTime(sessions),
      averageWeeklyMeditationDuration: calculateAverageWeeklyMeditationDuration(sessions),
      averageSessionDurationMinutes: calculateAverageSessionDurationMinutes(sessions),
      averageSessionDurationOffset: calculateAverageSessionDurationOffset(sessions),
      currentConsecutiveDays: calculateCurrentConsecutiveDays(sessions),
      longestConsecutiveDays: calculateLongestConsecutiveDays(sessions),
      longestSessionMinutes: calculateLongestSessionMinutes(sessions)
    };

    excludedMetrics.forEach((metric) => delete metrics[metric]);

    return metrics;
  }, [sessions, excludedMetrics]);
};

export default useMeditationMetrics;
