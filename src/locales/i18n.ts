import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { languages } from './config-lang';
import en from './langs/en.json';
import fr from './langs/fr.json';

export type AvailableLangage = (typeof languages)[number];

const DEFAULT_LANGAGE: AvailableLangage['code'] = 'en';

const langage = localStorage.getItem('lang');
const i18n = i18next.use(initReactI18next); // passes i18n down to react-i18next

const formatDateTime = (value: string, format: string = '', lng: string = '') => {
  if (format === 'datetime') {
    return new Intl.DateTimeFormat(lng, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(value));
  }
  return value;
};

i18n.init({
  // the translations
  // (tip move them in a JSON file and import them,
  // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
  resources: {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
  },
  lng: langage || DEFAULT_LANGAGE, // if you're using a language detector, do not define the lng option
  // fallbackLng: 'en',

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    format: formatDateTime,
  },
});

export default i18n;

export const changeLanguage = (lang: AvailableLangage['code']) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('lang', lang);
};
