import { ReactNode } from 'react';
import { Heading, Text } from 'src/domains/shared/components/ui/Text';

const ScreenLayout = ({
  title,
  subtitle,
  children,
  topRightComponent,
  headerHidden = false
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  topRightComponent?: ReactNode; // Composant en haut à droite de l'écran
  headerHidden?: boolean; // Estompe l'en-tête (titre) sans libérer sa place
}) => {
  return (
    <section
      aria-label={title}
      className="flex min-h-0 flex-1 flex-col bg-platinium"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {/* Colonne de contenu : pleine largeur sur mobile, centrée et bornée sur desktop.
          min-h-0 à chaque maillon flex pour que les zones scrollables internes
          (listes…) soient bornées et puissent défiler sans déborder. */}
      <div className="mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col p-10">
        <header
          className={`flex flex-row items-start justify-between transition-opacity duration-500 ${
            headerHidden ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <Heading level={1} className="text-4xl">
              {title}
            </Heading>
            {subtitle && (
              <Text as="p" className="text-lg">
                {subtitle}
              </Text>
            )}
          </div>
          {topRightComponent && <div className="ml-2 mt-1">{topRightComponent}</div>}
        </header>
        <div className="mt-4 flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </section>
  );
};

export default ScreenLayout;
