import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Text } from 'src/domains/shared/components/ui/Text';
import HorizontalLine from 'src/domains/shared/components/HorizontalLine';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import ActivityRibbon from 'src/domains/timeline/components/ActivityRibbon';
import { buildDailyActivity, buildContinuousWeeks } from 'src/domains/timeline/activity-calendar.utils';
import { getWeekDays } from 'src/domains/shared/utils/date.utils';
import { useAppData } from 'src/store/useAppData';
import { DayRouteState, ROUTES } from 'src/app/navigation/routes';

const CalendarScreen = () => {
  const navigate = useNavigate();
  const { meditationSessions } = useAppData();

  const sessions = useMemo(() => meditationSessions ?? [], [meditationSessions]);
  const activity = useMemo(() => buildDailyActivity(sessions), [sessions]);
  const weekDays = useMemo(() => getWeekDays(), []);

  const weeks = useMemo(() => {
    const today = new Date();
    const earliest = sessions.reduce<Date>((min, s) => {
      const date = new Date(s.date);
      return date < min ? date : min;
    }, today);
    return buildContinuousWeeks(earliest, today);
  }, [sessions]);

  const totalCount = sessions.length;
  const subtitle =
    totalCount > 0
      ? `${totalCount.toLocaleString('fr-FR')} ${totalCount > 1 ? 'méditations' : 'méditation'}`
      : undefined;

  const openDay = (date: string) => {
    navigate(ROUTES.day, { state: { date } satisfies DayRouteState });
  };

  return (
    <ScreenLayout title="Activités" subtitle={subtitle}>
      <HorizontalLine />

      <div className="min-h-0 flex-1 overflow-y-auto pt-5">
        {totalCount === 0 ? (
          <Text className="mb-4 text-base text-gray-500">Aucune méditation enregistrée.</Text>
        ) : (
          <ActivityRibbon
            weeks={weeks}
            weekDays={weekDays}
            activity={activity}
            onDayClick={openDay}
          />
        )}
      </div>
    </ScreenLayout>
  );
};

export default CalendarScreen;
