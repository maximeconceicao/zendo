import { useMemo } from 'react';
import { MeditationMetrics } from 'src/types/activity.types';
import { MeditationSession } from 'src/types/storage.types';
import {
  calculateTotalMeditationTime,
  calculateCurrentConsecutiveDays,
  calculateLongestSessionMinutes,
  calculateAverageWeeklyMeditationDuration,
  calculateAverageSessionDurationMinutes,
  calculateAverageSessionDurationOffset,
  calculateLongestConsecutiveDays
} from 'src/utils/activity.utils';

const useMeditationMetrics = (sessions: MeditationSession[]): MeditationMetrics => {
  return useMemo(() => {
    const totalSessions = sessions.length;
    const totalMeditatedTimeSpent = calculateTotalMeditationTime(sessions);
    const averageWeeklyMeditationDuration = calculateAverageWeeklyMeditationDuration(sessions);
    const averageSessionDurationMinutes = calculateAverageSessionDurationMinutes(sessions);
    const averageSessionDurationOffset = calculateAverageSessionDurationOffset(sessions);
    const currentConsecutiveDays = calculateCurrentConsecutiveDays(sessions);
    const longestConsecutiveDays = calculateLongestConsecutiveDays(sessions);
    const longestSessionMinutes = calculateLongestSessionMinutes(sessions);

    return {
      totalSessions,
      totalMeditatedTimeSpent,
      averageWeeklyMeditationDuration,
      averageSessionDurationMinutes,
      averageSessionDurationOffset,
      currentConsecutiveDays,
      longestConsecutiveDays,
      longestSessionMinutes
    };
  }, [sessions]);
};

export default useMeditationMetrics;
