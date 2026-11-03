import { ReactNode, useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modale portée dans <body> via un portal. Par rapport à l'ancienne version
 * (dans primitives.tsx), ajoute : verrou du scroll de l'arrière-plan, focus
 * initial dans la modale, piège de tabulation et restauration du focus à la
 * fermeture. Fermeture au clavier (Échap) conservée.
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalProps = {
  visible: boolean;
  children: ReactNode;
  onRequestClose?: () => void;
};

export const Modal = ({ visible, children, onRequestClose }: ModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // `onRequestClose` est souvent une lambda recréée à chaque rendu. On la garde
  // dans une ref pour que l'effet ci-dessous ne dépende que de `visible` et ne
  // se relance pas à chaque rendu (ce qui volerait le focus / re-verrouillerait
  // le scroll tant que la modale est ouverte).
  const onRequestCloseRef = useRef(onRequestClose);
  useLayoutEffect(() => {
    onRequestCloseRef.current = onRequestClose;
  });

  useEffect(() => {
    if (!visible) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onRequestCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const root = containerRef.current;
      if (!root) return;
      const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) {
        event.preventDefault();
        root.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const root = containerRef.current;
    const firstFocusable = root?.querySelector<HTMLElement>(FOCUSABLE);
    (firstFocusable ?? root)?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [visible]);

  if (!visible) return null;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex animate-[fadeIn_120ms_ease-out] focus:outline-none"
    >
      {children}
    </div>,
    document.body
  );
};
