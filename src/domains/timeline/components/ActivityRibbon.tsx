import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Text } from 'src/domains/shared/components/ui/Text';
import { capitalizeFirstLetter } from 'src/domains/shared/utils/common.utils';
import {
  CalendarWeek,
  DailyActivity,
  dayKey
} from 'src/domains/timeline/activity-calendar.utils';

// Ruban pleine largeur : les carrés remplissent les 7 colonnes (1fr chacune),
// l'écart reste minimal pour une suite continue, sans séparation de mois.
const GAP = 4;
const GUTTER = 36;

// Case vide vs. jour avec au moins une méditation : pas de nuances de gris,
// on passe directement au noir du bouton « Démarrer la méditation ».
const EMPTY_COLOR = 'rgba(0, 0, 0, 0.06)';
const ACTIVE_COLOR = 'rgba(0, 0, 0, 0.9)';

type ActivityRibbonProps = {
  weeks: CalendarWeek[];
  weekDays: string[];
  activity: Map<string, DailyActivity>;
  onDayClick: (dateKey: string) => void;
};

/** Étiquette de mois ; l'année n'apparaît qu'en janvier pour lever l'ambiguïté. */
const monthLabel = (date: Date): string => {
  const base = capitalizeFirstLetter(format(date, 'MMM', { locale: fr }));
  return date.getMonth() === 0 ? `${base} ${format(date, 'yy')}` : base;
};

const ActivityRibbon = ({ weeks, weekDays, activity, onDayClick }: ActivityRibbonProps) => {
  const columns = 'repeat(7, 1fr)';

  return (
    <div className="flex w-full flex-col">
      {/* En-tête des jours, aligné sur les colonnes et décalé de la gouttière. */}
      <div
        className="mb-2 grid"
        style={{ gridTemplateColumns: columns, gap: GAP, marginLeft: GUTTER }}
      >
        {weekDays.map((label, index) => (
          <Text key={index} className="text-center text-xs text-gray-400">
            {label}
          </Text>
        ))}
      </div>

      {/* Ruban : une ligne par semaine, empilées sans séparation. */}
      <div className="flex flex-col" style={{ gap: GAP }}>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex items-center" style={{ gap: GAP }}>
            <div
              className="shrink-0 text-right text-[11px] leading-none text-gray-400"
              style={{ width: GUTTER, paddingRight: GAP }}
            >
              {week.labelDate ? monthLabel(week.labelDate) : ''}
            </div>

            <div className="grid flex-1" style={{ gridTemplateColumns: columns, gap: GAP }}>
              {week.days.map(({ date, inRange }, dayIndex) => {
                if (!inRange) {
                  return <div key={dayIndex} className="aspect-square" aria-hidden="true" />;
                }

                const key = dayKey(date);
                const dayActivity = activity.get(key);
                const squareStyle = {
                  backgroundColor: dayActivity ? ACTIVE_COLOR : EMPTY_COLOR
                };

                if (!dayActivity) {
                  return (
                    <div
                      key={dayIndex}
                      className="aspect-square rounded-[3px]"
                      style={squareStyle}
                      title={format(date, 'd MMM', { locale: fr })}
                    />
                  );
                }

                const minutes = Math.round(dayActivity.totalSeconds / 60);
                return (
                  <button
                    key={dayIndex}
                    type="button"
                    onClick={() => onDayClick(key)}
                    className="aspect-square cursor-pointer rounded-[3px]"
                    style={squareStyle}
                    title={`${format(date, 'd MMM', { locale: fr })} — ${dayActivity.count} méditation(s), ${minutes} min`}
                    aria-label={`${format(date, 'd MMMM', { locale: fr })} : ${dayActivity.count} méditation(s), ${minutes} minutes`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityRibbon;
