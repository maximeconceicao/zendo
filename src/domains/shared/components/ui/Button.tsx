import { ButtonHTMLAttributes, forwardRef } from 'react';

/**
 * Bouton de l'app, sur <button> natif. Centralise l'apparence des boutons
 * répétés inline dans les écrans. La variante ne pilote que la surface/couleur ;
 * la forme et l'espacement (rounded-*, px/py, w-full…) restent passés en
 * className par l'appelant, pour couvrir les gabarits variés existants.
 */

type Variant = 'primary' | 'outline' | 'subtle';

const variantClass: Record<Variant, string> = {
  // CTA plein, noir de marque légèrement transparent (cf. ancien rgba(0,0,0,0.9)).
  primary: 'bg-ink/90 text-white',
  // Contour discret (ancien border 1px rgba(0,0,0,0.12)).
  outline: 'border border-ink/[0.12]',
  // Fond très léger + liseré (ancien bouton Pause : rgba(0,0,0,0.055)/0.08).
  subtle: 'bg-ink/5 border border-ink/[0.08]'
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', type, className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={`inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 disabled:cursor-default ${variantClass[variant]} ${className ?? ''}`.trim()}
      {...props}
    />
  );
});
