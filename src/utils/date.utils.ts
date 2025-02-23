import { startOfMonth, getDay, eachDayOfInterval, endOfMonth, format } from 'date-fns';

export const getCurrentMonthTitle = (date: Date): string => {
  return format(date, 'MMMM yyyy');
};

export const generateCalendar = (date: Date): string[][] => {
  const firstDayOfMonth: Date = startOfMonth(date);
  const offset: number = (getDay(firstDayOfMonth) + 6) % 7;
  const daysInMonth: number[] = eachDayOfInterval({
    start: firstDayOfMonth,
    end: endOfMonth(date)
  }).map((day) => day.getDate());

  const calendar: string[][] = [];
  let week: string[] = Array(offset).fill('');

  daysInMonth.forEach((day: number) => {
    week.push(day.toString());
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  });

  if (week.length) {
    while (week.length < 7) week.push('');
    calendar.push(week);
  }

  return calendar;
};

export const getWeekDays = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => format(new Date(2022, 0, i + 3), 'EEE'));
};
