import { NavLink } from 'react-router-dom';
import { Calendar, Home, Settings } from 'lucide-react';
import { TabKey, TAB_LABELS, TAB_ORDER } from 'src/app/navigation/MainTabs';

const ICONS: Record<TabKey, typeof Home> = {
  settings: Settings,
  home: Home,
  activity: Calendar
};

/**
 * Rail de navigation vertical, visible à partir de `md` (desktop). Sur mobile,
 * la navigation reste gestuelle (swipe) avec l'indicateur en pastille. Les liens
 * pointent sur les mêmes routes `/settings`, `/home`… : l'état actif suit donc
 * aussi bien le clic que le swipe (l'URL est synchronisée dans les deux sens).
 */
const NavRail = ({ hidden = false }: { hidden?: boolean }) => (
  <nav
    aria-label="Navigation principale"
    className={`${
      hidden ? 'md:hidden' : 'md:flex'
    } hidden shrink-0 flex-col gap-2 border-r border-ink/10 p-3`}
  >
    {TAB_ORDER.map((key) => {
      const Icon = ICONS[key];
      return (
        <NavLink
          key={key}
          to={`/${key}`}
          className={({ isActive }) =>
            `flex w-20 flex-col items-center gap-1 rounded-2xl px-3 py-3 text-xs transition-colors ${
              isActive ? 'bg-ink/90 text-white' : 'text-gray-500 hover:bg-ink/5'
            }`
          }
        >
          <Icon size={22} strokeWidth={1.5} />
          {TAB_LABELS[key]}
        </NavLink>
      );
    })}
  </nav>
);

export default NavRail;
