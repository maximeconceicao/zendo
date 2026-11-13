import { describe, expect, test } from 'vitest';
import { format } from 'date-fns';
import { buildContinuousWeeks, buildDailyActivity, dayKey } from './activity-calendar.utils';
import { MeditationSession } from 'src/data/storage.types';

const makeSession = (date: string, actual: number): MeditationSession => ({
  id: `${date}-${actual}`,
  date,
  plannedDurationSeconds: actual,
  actualDurationSeconds: actual
});

describe('buildDailyActivity', () => {
  test('agrège plusieurs séances d’un même jour', () => {
    const map = buildDailyActivity([
      makeSession('2026-11-03T08:00:00.000Z', 600),
      makeSession('2026-11-03T20:00:00.000Z', 1200),
      makeSession('2026-11-05T09:00:00.000Z', 300)
    ]);
    const nov3 = dayKey(new Date('2026-11-03T08:00:00.000Z'));
    const nov5 = dayKey(new Date('2026-11-05T09:00:00.000Z'));
    expect(map.get(nov3)).toEqual({ count: 2, totalSeconds: 1800 });
    expect(map.get(nov5)).toEqual({ count: 1, totalSeconds: 300 });
  });

  test('map vide pour aucune séance', () => {
    expect(buildDailyActivity([]).size).toBe(0);
  });
});

describe('buildContinuousWeeks', () => {
  test('ruban continu, semaines de 7 jours, plus récente en premier', () => {
    const weeks = buildContinuousWeeks(new Date(2026, 9, 1), new Date(2026, 10, 12));
    expect(weeks.length).toBeGreaterThan(0);
    weeks.forEach((week) => expect(week.days).toHaveLength(7));
    // La première ligne (en haut) contient aujourd'hui.
    const firstWeekKeys = weeks[0].days.map((cell) => dayKey(cell.date));
    expect(firstWeekKeys).toContain('2026-11-12');
  });

  test('chaque jour de chaque semaine commence un lundi', () => {
    const weeks = buildContinuousWeeks(new Date(2026, 9, 1), new Date(2026, 10, 12));
    weeks.forEach((week) => expect(week.days[0].date.getDay()).toBe(1));
  });

  test('exactement une étiquette par mois couvert', () => {
    const weeks = buildContinuousWeeks(new Date(2026, 7, 15), new Date(2026, 10, 3));
    const labels = weeks
      .map((week) => week.labelDate)
      .filter((date): date is Date => date !== null)
      .map((date) => format(date, 'yyyy-MM'));
    // Aoû, Sep, Oct, Nov 2026 — une étiquette chacun, du plus récent au plus ancien.
    expect(labels).toEqual(['2026-11', '2026-10', '2026-09', '2026-08']);
  });

  test('le ruban démarre au jour de la première méditation, pas au début du mois', () => {
    const earliest = new Date(2026, 10, 12); // jeudi 12 nov. : première méditation
    const weeks = buildContinuousWeeks(earliest, new Date(2026, 10, 12));
    const cells = weeks.flatMap((week) => week.days);

    // Le jour de la première méditation est dans la période.
    const earliestCell = cells.find((cell) => dayKey(cell.date) === dayKey(earliest));
    expect(earliestCell?.inRange).toBe(true);

    // Les jours de la même semaine qui la précèdent (lun.→mer.) restent hors période.
    const before = cells.filter((cell) => cell.date < earliest);
    expect(before.length).toBeGreaterThan(0);
    before.forEach((cell) => expect(cell.inRange).toBe(false));
  });

  test('les jours hors période sont marqués inRange: false', () => {
    const weeks = buildContinuousWeeks(new Date(2026, 10, 10), new Date(2026, 10, 12));
    const future = weeks[0].days.find((cell) => cell.date > new Date(2026, 10, 12));
    expect(future?.inRange).toBe(false);
  });
});
