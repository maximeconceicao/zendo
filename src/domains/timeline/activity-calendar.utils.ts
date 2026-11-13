import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  startOfDay,
  startOfWeek
} from 'date-fns';
import { MeditationSession } from 'src/data/storage.types';

export type DailyActivity = { count: number; totalSeconds: number };

/** Clé de jour locale (yyyy-MM-dd), cohérente entre sessions et cases du calendrier. */
export const dayKey = (date: Date): string => format(date, 'yyyy-MM-dd');

/** Agrège les séances par jour : nombre de séances et secondes totales. */
export const buildDailyActivity = (sessions: MeditationSession[]): Map<string, DailyActivity> => {
  const map = new Map<string, DailyActivity>();
  for (const session of sessions) {
    const key = dayKey(new Date(session.date));
    const prev = map.get(key) ?? { count: 0, totalSeconds: 0 };
    map.set(key, {
      count: prev.count + 1,
      totalSeconds: prev.totalSeconds + session.actualDurationSeconds
    });
  }
  return map;
};

/** Une case du ruban : un jour, et s'il tombe ou non dans la période affichée. */
export type CalendarCell = { date: Date; inRange: boolean };

/**
 * Une semaine du ruban : 7 cases (lundi→dimanche) et, le cas échéant, le jour
 * à utiliser pour afficher l'étiquette du mois dans la gouttière de gauche.
 */
export type CalendarWeek = { days: CalendarCell[]; labelDate: Date | null };

/**
 * Construit un ruban d'activité continu façon GitLab : toutes les semaines du
 * jour de `earliest` (la première méditation) jusqu'à aujourd'hui, empilées sans
 * séparation, la plus récente en premier. Les jours hors période (bords de
 * grille et jours précédant la première méditation) restent présents pour garder
 * un ruban rectangulaire, mais marqués `inRange: false`.
 *
 * L'étiquette de mois est posée sur la semaine la plus récente de chaque mois
 * (en parcourant du haut vers le bas), ce qui place le libellé en tête de bloc.
 */
export const buildContinuousWeeks = (earliest: Date, today: Date): CalendarWeek[] => {
  const rangeStart = startOfDay(earliest);
  const gridStart = startOfWeek(rangeStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(today, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(
      days.slice(i, i + 7).map((date) => ({
        date,
        inRange: !isBefore(date, rangeStart) && !isAfter(date, today)
      }))
    );
  }
  weeks.reverse();

  let lastMonthKey: string | null = null;
  return weeks.map((cells) => {
    const ref = [...cells].reverse().find((cell) => cell.inRange)?.date ?? null;
    const monthKey = ref ? format(ref, 'yyyy-MM') : null;
    let labelDate: Date | null = null;
    if (ref && monthKey !== lastMonthKey) {
      labelDate = ref;
      lastMonthKey = monthKey;
    }
    return { days: cells, labelDate };
  });
};
