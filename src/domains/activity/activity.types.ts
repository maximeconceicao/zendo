export type MeditationMetrics = {
  totalSessions: number;
  totalMeditatedTimeSpent: { days: number; hours: number; minutes: number };
  averageWeeklyMeditationDuration: { hours: number; minutes: number };
  averageSessionDurationMinutes: number;
  averageSessionDurationOffset: number;
  currentConsecutiveDays: number;
  longestConsecutiveDays: number;
  longestSessionMinutes: number;
};
