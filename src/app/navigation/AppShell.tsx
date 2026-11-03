import { ReactNode } from 'react';
import NavRail from 'src/app/navigation/NavRail';

/**
 * Coquille applicative : rail de navigation latéral (desktop) + zone de contenu.
 * Partagée par les onglets swipables (MainTabs) et les écrans hors-onglets
 * (ex. le détail d'un jour) pour que le rail soit présent partout sur desktop.
 *
 * La zone de contenu est un conteneur flex-col pleine hauteur avec min-h-0, afin
 * que les écrans à zone scrollable interne (listes…) se bornent correctement.
 */
const AppShell = ({ children, railHidden = false }: { children: ReactNode; railHidden?: boolean }) => (
  <div className="flex h-full w-full flex-row">
    <NavRail hidden={railHidden} />
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
  </div>
);

export default AppShell;
