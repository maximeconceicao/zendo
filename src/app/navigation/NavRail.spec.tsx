import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import NavRail from './NavRail';

describe('NavRail', () => {
  it('rend un lien vers chacun des trois écrans', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/home']}>
        <NavRail />
      </MemoryRouter>
    );
    expect(html).toContain('href="/settings"');
    expect(html).toContain('href="/home"');
    expect(html).toContain('href="/activity"');
    expect(html).toContain('aria-label="Navigation principale"');
  });

  it('marque l’écran courant comme actif', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/activity']}>
        <NavRail />
      </MemoryRouter>
    );
    // NavLink pose aria-current="page" + le style actif sur le lien courant.
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('bg-ink/90');
  });
});
