import { MeditationMetrics } from 'src/domains/activity/activity.types';
import { MeditationSession } from 'src/data/storage.types';

export type MetricData =
  | {
      type: 'data';
      label: string;
      value: string;
    }
  | { type: 'button'; label: string; onPress: () => void };

/*
 * Meditation Sessions Filters
 */

const getSessionsFromLastDays = (
  sessions: MeditationSession[],
  days: number
): MeditationSession[] => {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - days);

  return sessions.filter((session) => new Date(session.date) >= pastDate);
};

export const getLast30DaysSessions = (sessions: MeditationSession[]): MeditationSession[] => {
  return getSessionsFromLastDays(sessions, 30);
};

export const getLast365DaysSessions = (sessions: MeditationSession[]): MeditationSession[] => {
  return getSessionsFromLastDays(sessions, 365);
};

/*
 * Meditation Metrics Calculations
 */

export const calculateTotalMeditationTime = (
  sessions: MeditationSession[]
): { days: number; hours: number; minutes: number } => {
  const totalSeconds = sessions.reduce((acc, session) => acc + session.actualDurationSeconds, 0);

  const days = Math.floor(totalSeconds / (3600 * 24));
  const remainingSecondsAfterDays = totalSeconds % (3600 * 24);

  const hours = Math.floor(remainingSecondsAfterDays / 3600);
  const minutes = Math.floor((remainingSecondsAfterDays % 3600) / 60);

  return { days, hours, minutes };
};

export const calculateCurrentConsecutiveDays = (sessions: MeditationSession[]): number => {
  const dates = sessions.map((session) => new Date(session.date));
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

  // Check if there is a session today
  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todaySession = sortedDates.some((date) => date >= todayStart);

  // Check if there is a session yesterday
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
  const yesterdaySession = sortedDates.some((date) => date >= yesterdayStart && date < todayStart);

  if (!yesterdaySession && !todaySession) return 0; // No session yesterday or today
  if (!yesterdaySession && todaySession) return 1; // No session yesterday, but there is a session today

  // If there is a session yesterday and today, calculate the consecutive days
  return sortedDates.reduce((streak, current, index, arr) => {
    if (index === 0) return 1;
    const prev = arr[index - 1];
    const diffInDays = (current.getTime() - prev.getTime()) / (1000 * 3600 * 24);
    return diffInDays === 1 ? streak + 1 : streak;
  }, 1);
};

export const calculateLongestSessionMinutes = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;
  const longestSessionSeconds = Math.max(
    ...sessions.map((session) => session.actualDurationSeconds)
  );
  return Math.floor(longestSessionSeconds / 60);
};

export const calculateAverageSessionDurationMinutes = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;
  const totalDuration = sessions.reduce((sum, session) => sum + session.actualDurationSeconds, 0);
  return Math.round(totalDuration / sessions.length / 60);
};

export const calculateAverageSessionDurationOffset = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;
  const totalOffset = sessions.reduce(
    (sum, session) => sum + (session.actualDurationSeconds - session.plannedDurationSeconds),
    0
  );
  return Math.round(totalOffset / sessions.length / 60);
};

export const calculateLongestConsecutiveDays = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;

  const dates = new Set(sessions.map((session) => session.date.split('T')[0]));
  let longestStreak = 0;
  let currentStreak = 0;
  let prevDate: string | null = null;

  Array.from(dates)
    .sort()
    .forEach((date) => {
      if (prevDate && new Date(date).getTime() - new Date(prevDate).getTime() === 86400000) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      prevDate = date;
    });

  return longestStreak;
};

export const calculateAverageWeeklyMeditationDuration = (sessions: MeditationSession[]) => {
  if (sessions.length === 0) return { hours: 0, minutes: 0 };

  const totalDurationSeconds = sessions.reduce(
    (sum, session) => sum + session.actualDurationSeconds,
    0
  );
  const totalWeeks = Math.max(1, new Set(sessions.map((s) => s.date.split('-W')[1])).size);

  const averageDurationMinutes = Math.round(totalDurationSeconds / totalWeeks / 60);
  return {
    hours: Math.floor(averageDurationMinutes / 60),
    minutes: averageDurationMinutes % 60
  };
};

export function getTotalFocusPoints(sessions: MeditationSession[]): number {
  return sessions.reduce((total, session) => {
    return total + (session.focusPoints?.length || 0);
  }, 0);
}
/*
 * Meditation Metrics Formating
 */

export const formatMeditationMetrics = (metrics: Partial<MeditationMetrics>): MetricData[] => {
  const metricMap: Record<string, string | undefined> = {
    'Total de sessions': metrics.totalSessions?.toString(),
    'Temps total de méditation':
      metrics.totalMeditatedTimeSpent !== undefined
        ? `${metrics.totalMeditatedTimeSpent.days ? metrics.totalMeditatedTimeSpent.days + 'j ' : ''}${metrics.totalMeditatedTimeSpent.hours ? metrics.totalMeditatedTimeSpent.hours + 'h ' : ''}${metrics.totalMeditatedTimeSpent.minutes ?? 0}min`
        : undefined,
    "Durée moyenne d'une session":
      metrics.averageSessionDurationMinutes !== undefined
        ? metrics.averageSessionDurationMinutes.toString() + 'min'
        : undefined,
    'Moyenne par semaine':
      metrics.averageWeeklyMeditationDuration !== undefined
        ? `${metrics.averageWeeklyMeditationDuration.hours ? metrics.averageWeeklyMeditationDuration.hours + 'h ' : ''} ${metrics.averageWeeklyMeditationDuration.minutes}min`
        : undefined,
    'Série actuelle':
      metrics.currentConsecutiveDays !== undefined
        ? metrics.currentConsecutiveDays.toString() + ' jours'
        : undefined,
    'Plus longue série':
      metrics.longestConsecutiveDays !== undefined
        ? metrics.longestConsecutiveDays.toString() + ' jours'
        : undefined,
    'Record de la plus longue session':
      metrics.longestSessionMinutes !== undefined
        ? metrics.longestSessionMinutes.toString() + 'min'
        : undefined
  };

  return Object.entries(metricMap)
    .filter(([, value]) => value !== undefined)
    .map(([label, value]) => ({ label, value: value!, type: 'data' }));
};

export const getFocusPointsMetricData = (sessions: MeditationSession[]): MetricData[] => {
  return [
    {
      label: 'Total de recentrages',
      value: getTotalFocusPoints(sessions).toString(),
      type: 'data'
    },
    {
      label: 'Évolution des recentrages',
      type: 'button',
      onPress: () => {}
    }
  ];
};
