import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TabIndicator from 'src/app/navigation/TabIndicator';
import AppShell from 'src/app/navigation/AppShell';
import { useMeditationActive } from 'src/store/MeditationActiveContext';

export type TabKey = 'settings' | 'home' | 'calendar';

// Ordre horizontal des onglets.
export const TAB_ORDER: TabKey[] = ['settings', 'home', 'calendar'];

// Libellés lisibles, partagés par l'indicateur mobile et le rail desktop.
export const TAB_LABELS: Record<TabKey, string> = {
  settings: 'Réglages',
  home: 'Accueil',
  calendar: 'Activités'
};

const isTabKey = (value: string | undefined): value is TabKey =>
  !!value && (TAB_ORDER as string[]).includes(value);

/**
 * Conteneur d'onglets swipable (CSS scroll-snap), sans barre d'onglets visible.
 * Tous les onglets sont montés en permanence. La position de défilement est
 * synchronisée avec l'URL (`/settings`, `/home`, …) dans les deux sens.
 */
const MainTabs = ({ tabs }: { tabs: Record<TabKey, ReactNode> }) => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const { isMeditating } = useMeditationActive();

  const activeKey: TabKey = isTabKey(tab) ? tab : 'home';
  const activeIndex = TAB_ORDER.indexOf(activeKey);

  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);
  const didInit = useRef(false);
  const scrollEndTimer = useRef<number | undefined>(undefined);
  const rafId = useRef<number | undefined>(undefined);
  // Annule le « settle » en cours (listener scrollend + repli par délai).
  const cancelSettle = useRef<(() => void) | null>(null);

  // Position de défilement fractionnaire (ex. 1.4) qui pilote l'indicateur.
  const [scrollProgress, setScrollProgress] = useState(activeIndex);
  const activeKeyRef = useRef<TabKey>(activeKey);
  const activeIndexRef = useRef(activeIndex);
  activeKeyRef.current = activeKey;
  activeIndexRef.current = activeIndex;

  // Abaisse le drapeau « scroll programmatique » à la fin RÉELLE du défilement
  // (évènement scrollend), avec repli par délai pour les navigateurs sans support.
  const settleProgrammaticScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    // Annule un settle précédent encore en attente (sans toucher au drapeau : ce
    // nouveau settle en reprend la responsabilité). Évite les closures et les
    // minuteurs qui se chevauchent quand deux scrolls programmatiques
    // s'enchaînent (montage + ResizeObserver).
    cancelSettle.current?.();

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      cancelSettle.current = null;
      isProgrammaticScroll.current = false;
      el.removeEventListener('scrollend', finish);
      window.clearTimeout(fallback);
    };
    // Repli par délai pour les navigateurs sans évènement `scrollend`.
    const fallback = window.setTimeout(finish, 700);
    el.addEventListener('scrollend', finish, { once: true });

    cancelSettle.current = () => {
      el.removeEventListener('scrollend', finish);
      window.clearTimeout(fallback);
      cancelSettle.current = null;
    };
  }, []);

  // Positionne le défilement sur l'onglet actif lorsqu'on y arrive via l'URL.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const target = activeIndex * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) < 2) {
      didInit.current = true;
      return;
    }

    isProgrammaticScroll.current = true;
    el.scrollTo({ left: target, behavior: didInit.current ? 'smooth' : 'auto' });
    didInit.current = true;
    settleProgrammaticScroll();
  }, [activeIndex, settleProgrammaticScroll]);

  // Réaligne le scroll sur l'onglet actif lors d'un redimensionnement / rotation
  // (les positions sont calculées en pixels à partir de clientWidth).
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      const target = activeIndexRef.current * el.clientWidth;
      // Déjà en place : ne pas lever le drapeau « scroll programmatique » pour un
      // non-mouvement. Sinon aucun `scrollend` ne vient le rabaisser et il reste
      // bloqué ~700 ms — fenêtre pendant laquelle un swipe utilisateur est ignoré
      // et l'URL se désynchronise de l'onglet affiché.
      if (Math.abs(el.scrollLeft - target) < 2) return;
      isProgrammaticScroll.current = true;
      el.scrollLeft = target;
      settleProgrammaticScroll();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [settleProgrammaticScroll]);

  // Met à jour l'URL quand l'utilisateur swipe (après stabilisation du scroll).
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    // Suit la position de défilement en continu (rAF) pour animer l'indicateur,
    // y compris pendant un défilement programmatique (navigation par clic).
    if (rafId.current === undefined) {
      rafId.current = window.requestAnimationFrame(() => {
        rafId.current = undefined;
        const node = containerRef.current;
        if (!node || node.clientWidth === 0) return;
        setScrollProgress(node.scrollLeft / node.clientWidth);
      });
    }

    if (isProgrammaticScroll.current) return;

    window.clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = window.setTimeout(() => {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      const key = TAB_ORDER[index];
      if (key && key !== activeKeyRef.current) {
        navigate(`/${key}`, { replace: true });
      }
    }, 120);
  }, [navigate]);

  // Nettoyage au démontage : frame rAF, debounce swipe→URL et settle en attente
  // (sinon un `navigate()` peut se déclencher après le démontage).
  useEffect(
    () => () => {
      if (rafId.current !== undefined) window.cancelAnimationFrame(rafId.current);
      window.clearTimeout(scrollEndTimer.current);
      cancelSettle.current?.();
    },
    []
  );

  const goToIndex = useCallback(
    (index: number) => {
      const key = TAB_ORDER[index];
      if (key && key !== activeKeyRef.current) navigate(`/${key}`);
    },
    [navigate]
  );

  return (
    // Le rail (desktop) est masqué pendant la séance : verrou de navigation.
    <AppShell railHidden={isMeditating}>
      {/* Conteneur des onglets swipables. */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`no-scrollbar flex h-full w-full flex-row overflow-y-hidden ${
          isMeditating ? 'overflow-x-hidden' : 'overflow-x-auto'
        }`}
        style={{
          scrollSnapType: isMeditating ? 'none' : 'x mandatory',
          touchAction: isMeditating ? 'pan-y' : 'auto'
        }}
      >
        {TAB_ORDER.map((key) => (
          <div
            key={key}
            className="flex h-full w-full shrink-0 grow-0 basis-full flex-col overflow-y-auto"
            style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          >
            {tabs[key]}
          </div>
        ))}
      </div>

      {/* Mobile uniquement : pastille d'indication (le rail la remplace sur desktop). */}
      <div
        className={`transition-opacity duration-500 md:hidden ${
          isMeditating ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-hidden={isMeditating}
      >
        <TabIndicator
          items={TAB_ORDER.map((key) => ({ key, label: TAB_LABELS[key] }))}
          progress={scrollProgress}
          onSelect={goToIndex}
        />
      </div>
    </AppShell>
  );
};

export default MainTabs;
