import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

import translations from 'src/locales/langs/en/translation.json';

const getNestedTranslation = (obj: any, key: string, options: any = {}) => {
  const translation = key.split('.').reduce((acc, part) => acc && acc[part], obj) || key;

  // Remplace les variables de type `{{variable}}` par leurs valeurs dans `options`
  return Object.keys(options).reduce((translated, variable) => {
    const regex = new RegExp(`{{\\s*${variable}\\s*}}`, 'g');
    return translated.replace(regex, options[variable]);
  }, translation);
};

vi.mock('i18next', () => ({
  t: (key: string, options = {}) => getNestedTranslation(translations, key, options),
}));
const mockUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await import('react-router-dom');
  return {
    ...actual,
    useNavigate: mockUsedNavigate,
    useLocation: vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
