import { useEffect } from 'react';
import useSWR from 'swr';
import { useDashboardState } from 'src/store/dashboardState';
import { DashboardId } from 'src/types/dashboard-interface';
import { MenuData } from 'src/types/dashboard-menu-interface';

import { ApiError } from '../utils/apiErrors';
import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';

export function useGetDashboardMenu({ dashboardId }: DashboardId) {
  const urlQuery = `${urls.dashboards.menu}?dashboard_id=${dashboardId}`;
  const { error, data, isLoading } = useSWR(urlQuery, apiFetcher, {});

  // This is a custom hook that sets the dashboard and update it in real time in the store
  const setDashboardMenu = useDashboardState((state) => state.setDashboardMenu);

  useEffect(() => {
    if (data) {
      setDashboardMenu(data as MenuData);
    }
  }, [data, setDashboardMenu]);

  return {
    error: error as ApiError,
    data: data as MenuData,
    isLoading,
  };
}
