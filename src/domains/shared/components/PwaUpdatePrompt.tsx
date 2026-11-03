import { useRegisterSW } from 'virtual:pwa-register/react';
import { Text } from 'src/domains/shared/components/ui/Text';

/**
 * Bannière discrète affichée quand une nouvelle version du service worker est
 * prête. On ne recharge jamais automatiquement (registerType: 'prompt') pour ne
 * pas interrompre une session de méditation : l'utilisateur déclenche lui-même la
 * mise à jour via « Recharger ».
 */
export const PwaUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW();

  if (!needRefresh) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4"
      // Décalée au-dessus de l'indicateur d'onglets flottant (TabIndicator, à
      // safe-area + 16px) pour ne pas le recouvrir quand la bannière s'affiche.
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}
    >
      <div className="flex w-full max-w-sm items-center justify-between gap-3 rounded-lg bg-ink/90 px-4 py-3 shadow-lg">
        <Text className="text-platinium text-sm">Nouvelle version disponible.</Text>
        <div className="flex items-center gap-2">
          <button type="button" className="px-2 py-1" onClick={() => setNeedRefresh(false)}>
            <Text className="text-platinium/70 text-sm">Plus tard</Text>
          </button>
          <button
            type="button"
            className="rounded-md bg-platinium px-3 py-1"
            onClick={() => updateServiceWorker(true)}
          >
            <Text weight="semibold" className="text-ink text-sm">
              Recharger
            </Text>
          </button>
        </div>
      </div>
    </div>
  );
};
