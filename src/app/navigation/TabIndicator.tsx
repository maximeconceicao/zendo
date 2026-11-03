// Géométrie (px). Le bouton englobe le point visuel + une zone de clic élargie.
const DOT = 6; // diamètre du point
const HIT_PAD = 7; // padding autour du point → zone tactile
const STEP = DOT + HIT_PAD * 2; // distance entre deux centres de points
const ACTIVE_DOT = 8; // diamètre du rond actif (légèrement plus gros)
const PAD_X = 8; // padding horizontal du conteneur arrondi
const PAD_Y = 6; // padding vertical du conteneur arrondi

type TabItem = { key: string; label: string };

/**
 * Indicateur d'onglets minimaliste : une barre arrondie flottante avec un point
 * par onglet et une capsule qui glisse. La position de la capsule est pilotée en
 * continu par `progress` (position de défilement fractionnaire, ex. 1.4), ce qui
 * la rend parfaitement synchronisée avec le swipe des onglets — sans transition
 * CSS qui retarderait le mouvement sous le doigt.
 */
const TabIndicator = ({
  items,
  progress,
  onSelect
}: {
  items: TabItem[];
  progress: number;
  onSelect: (index: number) => void;
}) => {
  const clamped = Math.max(0, Math.min(items.length - 1, progress));
  // Centre du premier point, puis décalage selon la progression.
  const firstCenter = PAD_X + HIT_PAD + DOT / 2;
  const pillCenter = firstCenter + clamped * STEP;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 z-40 flex flex-row justify-center"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
    >
      <div
        role="tablist"
        className="pointer-events-auto relative flex flex-row items-center rounded-full"
        style={{
          paddingInline: PAD_X,
          paddingBlock: PAD_Y,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.22)'
        }}
      >
        {/* Rond actif : glisse en continu avec le défilement. */}
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            // Centré (vertical + horizontal) sur le point visé, décalé par HIT_PAD.
            top: PAD_Y + HIT_PAD + DOT / 2 - ACTIVE_DOT / 2,
            left: pillCenter - ACTIVE_DOT / 2,
            width: ACTIVE_DOT,
            height: ACTIVE_DOT,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.55)',
            willChange: 'left'
          }}
        />

        {items.map((item, index) => {
          const distance = Math.abs(clamped - index);
          const isActive = distance < 0.5;
          // Les points inactifs s'estompent légèrement à l'approche de la capsule
          // (la capsule blanche passe par-dessus), restituant un dégradé fluide.
          const dotOpacity = 0.3 + 0.25 * Math.max(0, 1 - distance);

          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={item.label}
              onClick={() => onSelect(index)}
              className="flex items-center justify-center"
              style={{ padding: HIT_PAD }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: DOT,
                  height: DOT,
                  backgroundColor: '#FFFFFF',
                  opacity: dotOpacity,
                  transition: 'opacity 200ms ease-out'
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabIndicator;
