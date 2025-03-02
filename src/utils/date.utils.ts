import { startOfMonth, getDay, eachDayOfInterval, endOfMonth, format, subDays } from 'date-fns';

export const getCurrentMonthTitle = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
}

export const generateCalendar = (date: Date): CalendarDay[][] => {
  const firstDayOfMonth: Date = startOfMonth(date);
  const lastDayOfMonth: Date = endOfMonth(date);
  const daysInMonth: CalendarDay[] = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth
  }).map((day) => ({
    day: day.getDate(),
    isCurrentMonth: true
  }));

  const offset: number = (getDay(firstDayOfMonth) + 6) % 7;
  const previousMonthDays: CalendarDay[] = [];
  const nextMonthDays: CalendarDay[] = [];

  // Ajouter les jours du mois précédent
  const lastDayOfPrevMonth = subDays(firstDayOfMonth, 1).getDate();
  for (let i = offset; i > 0; i--) {
    previousMonthDays.push({ day: lastDayOfPrevMonth - i + 1, isCurrentMonth: false });
  }

  // Ajouter les jours du mois suivant si nécessaire
  const remainingCells = (7 - ((previousMonthDays.length + daysInMonth.length) % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push({ day: i, isCurrentMonth: false });
  }

  // Construire le calendrier
  const fullCalendar = [...previousMonthDays, ...daysInMonth, ...nextMonthDays];
  const calendar: CalendarDay[][] = [];

  for (let i = 0; i < fullCalendar.length; i += 7) {
    calendar.push(fullCalendar.slice(i, i + 7));
  }

  return calendar;
};
export const getWeekDays = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => format(new Date(2022, 0, i + 3), 'EEE'));
};
