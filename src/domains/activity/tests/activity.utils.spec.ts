import { MeditationSession } from 'src/data/storage.types';
import {
  calculateTotalMeditationTime,
  calculateCurrentConsecutiveDays,
  calculateLongestSessionMinutes,
  calculateAverageSessionDurationMinutes,
  calculateAverageSessionDurationOffset,
  calculateLongestConsecutiveDays,
  calculateAverageWeeklyMeditationDuration,
  getTotalFocusPoints
} from '../activity.utils';
import { MeditationFeeling } from 'src/domains/meditation/constants/session.constants';

const makeSession = (
  date: string,
  actual: number,
  planned: number = actual,
  focusPoints: number = 0
): MeditationSession => ({
  id: `${Date.now()}`,
  date,
  actualDurationSeconds: actual,
  plannedDurationSeconds: planned,
  focusPoints: new Array(focusPoints).fill(0),
  feeling: MeditationFeeling.Neutral
});

describe('Meditation Metrics', () => {
  test('calculateTotalMeditationTime', () => {
    const sessions = [
      makeSession('2023-01-01T00:00:00.000Z', 3600),
      makeSession('2023-01-02T00:00:00.000Z', 1800)
    ];
    expect(calculateTotalMeditationTime(sessions)).toEqual({ days: 0, hours: 1, minutes: 30 });
  });

  test('calculateCurrentConsecutiveDays - sessions for today, yesterday, and the day before', () => {
    const today = new Date();
    const yesterday = new Date(today);
    const dayBeforeYesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    const sessions = [
      makeSession(dayBeforeYesterday.toISOString(), 600),
      makeSession(yesterday.toISOString(), 600),
      makeSession(today.toISOString(), 600)
    ];

    expect(calculateCurrentConsecutiveDays(sessions)).toBe(3);
  });

  test('calculateCurrentConsecutiveDays - break series', () => {
    const sessions = [
      makeSession('2023-01-03T00:00:00.000Z', 600),
      makeSession('2023-01-02T00:00:00.000Z', 600),
      makeSession('2023-01-01T00:00:00.000Z', 600)
    ];
    expect(calculateCurrentConsecutiveDays(sessions)).toBe(0);
  });

  test('calculateLongestSessionMinutes', () => {
    const sessions = [
      makeSession('2023-01-01T00:00:00.000Z', 600),
      makeSession('2023-01-02T00:00:00.000Z', 900)
    ];
    expect(calculateLongestSessionMinutes(sessions)).toBe(15);
  });

  test('calculateAverageSessionDurationMinutes', () => {
    const sessions = [
      makeSession('2023-01-01T00:00:00.000Z', 600),
      makeSession('2023-01-02T00:00:00.000Z', 900)
    ];
    expect(calculateAverageSessionDurationMinutes(sessions)).toBe(13);
  });

  test('calculateAverageSessionDurationOffset', () => {
    const sessions = [
      makeSession('2023-01-01T00:00:00.000Z', 600, 900),
      makeSession('2023-01-02T00:00:00.000Z', 900, 600)
    ];
    expect(calculateAverageSessionDurationOffset(sessions)).toBe(0);
  });

  test('calculateLongestConsecutiveDays', () => {
    const sessions = [
      makeSession('2023-01-01T10:00:00.000Z', 600),
      makeSession('2023-01-02T10:00:00.000Z', 600),
      makeSession('2023-01-03T10:00:00.000Z', 600),
      makeSession('2023-01-05T10:00:00.000Z', 600)
    ];
    expect(calculateLongestConsecutiveDays(sessions)).toBe(3);
  });

  test('calculateAverageWeeklyMeditationDuration', () => {
    const sessions: MeditationSession[] = [
      { ...makeSession('2023-W01', 3600) },
      { ...makeSession('2023-W01', 1800) },
      { ...makeSession('2023-W02', 3600) }
    ];
    expect(calculateAverageWeeklyMeditationDuration(sessions)).toEqual({ hours: 1, minutes: 15 });
  });

  test('getTotalFocusPoints', () => {
    const sessions = [
      makeSession('2023-01-01T00:00:00.000Z', 600, 600, 3),
      makeSession('2023-01-02T00:00:00.000Z', 900, 900, 2)
    ];
    expect(getTotalFocusPoints(sessions)).toBe(5);
  });
});
