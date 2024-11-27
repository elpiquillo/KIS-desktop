import { useEffect } from 'react';
import useSWR from 'swr';
import { t } from 'i18next';

import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import DashboardAccessInterface from 'src/types/dashboard-access-interface';
import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';
import { ApiError } from '../utils/apiErrors';

export function useGetDashboardAccessesAll() {
  const { error, data, isLoading } = useSWR(urls.dashboards.list, apiFetcher, {});

  // This is a custom hook that sets the dashboards and update it in real time in the store
  const setApplications = useDashboardAccessState((state) => state.setApplications);

  useEffect(() => {
    if (data) {
      setApplications(data as DashboardAccessInterface[]);
    }
  }, [data, setApplications]);

  return {
    error: error as ApiError,
    data: data as DashboardAccessInterface[],
    isLoading,
  };
}

export function usePutDashboardAccess() {
  const { updateDashboardAccess } = useDashboardAccessState();

  const putDashboardAccess = async ({ id, favorite }: DashboardAccessInterface) => {
    try {
      const res = await apiFetcher(`${urls.dashboardAcceses.update}${id.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          dashboard_access: {
            favorite,
          },
        }),
      });

      updateDashboardAccess(
        res.dashboard_ids.find((dashboard: DashboardAccessInterface) => dashboard.id === id)
      );
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { putDashboardAccess };
}
