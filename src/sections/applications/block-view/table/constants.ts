import { t } from 'i18next';

export const filterOperatorOptions = [
  {
    label: `= (${t('applications.strict')})`,
    value: 'eq',
  },
  {
    label: `= (${t('applications.include')})`,
    value: 'like',
  },
  {
    label: '≠',
    value: 'ne',
  },
  {
    label: '>',
    value: 'gt',
  },
  {
    label: '>=',
    value: 'gte',
  },
  {
    label: '<',
    value: 'lt',
  },
  {
    label: '<=',
    value: 'lte',
  },
];
