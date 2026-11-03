import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMemo } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'src/domains/shared/components/ui/Button';
import ScreenLayout from 'src/domains/shared/layouts/ScreenLayout';
import MeditationList from 'src/domains/meditation/components/MeditationList';
import { useAppData } from 'src/store/useAppData';
import { capitalizeFirstLetter } from 'src/domains/shared/utils/common.utils';
import { dayKey } from 'src/domains/timeline/activity-calendar.utils';
import { DayRouteState, ROUTES } from 'src/app/navigation/routes';

const DayScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as DayRouteState | null;
  const { meditationSessions } = useAppData();

  const date = state?.date;

  const daySessions = useMemo(() => {
    if (!date) return [];
    return (meditationSessions ?? [])
      .filter((session) => dayKey(new Date(session.date)) === date)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [meditationSessions, date]);

  if (!date) {
    return <Navigate to={ROUTES.calendar} replace />;
  }

  const parsed = parseISO(date);
  const title = capitalizeFirstLetter(format(parsed, 'EEEE', { locale: fr }));
  const subtitle = format(parsed, 'd MMMM yyyy', { locale: fr });

  return (
    <ScreenLayout title={title} subtitle={subtitle}>
      {/* Zone scrollable : la liste défile ici, le bouton Retour reste ancré en bas. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <MeditationList sessions={daySessions} />
      </div>

      <Button
        variant="primary"
        className="mt-6 w-full shrink-0 rounded-full p-4 text-lg"
        onClick={() => navigate(-1)}
      >
        Retour
      </Button>
    </ScreenLayout>
  );
};

export default DayScreen;
