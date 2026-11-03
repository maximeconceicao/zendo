import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { Heading, Text } from './Text';
import Switch from './Switch';

describe('Text', () => {
  it('rend un <span> léger par défaut', () => {
    const html = renderToStaticMarkup(<Text>Bonjour</Text>);
    expect(html).toContain('<span');
    expect(html).toContain('font-sfLight');
    expect(html).toContain('Bonjour');
  });

  it('respecte `as` et `weight`', () => {
    const html = renderToStaticMarkup(
      <Text as="p" weight="semibold">
        Paragraphe
      </Text>
    );
    expect(html).toContain('<p');
    expect(html).toContain('font-sfSemibold');
  });
});

describe('Heading', () => {
  it('rend le niveau de titre demandé', () => {
    const html = renderToStaticMarkup(<Heading level={2}>Titre</Heading>);
    expect(html).toContain('<h2');
    expect(html).toContain('Titre');
  });
});

describe('Button', () => {
  it('rend un <button type="button"> par défaut', () => {
    const html = renderToStaticMarkup(<Button>Valider</Button>);
    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
    expect(html).toContain('bg-ink/90');
  });

  it('applique la variante outline', () => {
    const html = renderToStaticMarkup(<Button variant="outline">Annuler</Button>);
    expect(html).toContain('border-ink/[0.12]');
  });
});

describe('Switch', () => {
  it('rend une case à cocher accessible reflétant `checked`', () => {
    const html = renderToStaticMarkup(
      <Switch checked onChange={() => {}} aria-label="Activer" />
    );
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('checked');
    expect(html).toContain('aria-label="Activer"');
  });
});
