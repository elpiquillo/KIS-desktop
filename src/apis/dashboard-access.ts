import { useEffect } from 'react';
import useSWR from 'swr';
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
