import { t } from 'i18next';

export default function formatDate(isoString: string) {
  return t('date.format', { value: isoString });
}
