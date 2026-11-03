import { useId } from 'react';

/**
 * Interrupteur sur <input type="checkbox"> natif (accessible, focalisable,
 * actionnable au clavier), stylé via les variantes `peer` de Tailwind.
 * Remplace l'ancien Switch qui imitait l'API de React Native.
 */

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
};

const Switch = ({ checked, onChange, id, ...aria }: SwitchProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className="relative inline-flex shrink-0 cursor-pointer items-center">
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        {...aria}
      />
      {/* Rail */}
      <span className="h-7 w-12 rounded-full bg-[#A0A0A0] transition-colors peer-checked:bg-[#505050] peer-focus-visible:ring-2 peer-focus-visible:ring-ink/40" />
      {/* Pastille : centrée verticalement (top-1 = (28−20)/2), part à 4px (left-1),
          glisse de 20px (→ 24px) une fois cochée. */}
      <span className="pointer-events-none absolute left-1 top-1 h-5 w-5 rounded-full bg-black transition-transform peer-checked:translate-x-5" />
    </label>
  );
};

export default Switch;
