import { t } from 'i18next';

import { useDashboardState } from 'src/store/dashboardState';
import { DashboardPageCreate, PageInterface } from 'src/types/page-interface';

import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';
import { ApiError } from '../utils/apiErrors';
