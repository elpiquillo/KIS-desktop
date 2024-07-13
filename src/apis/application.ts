import { useEffect } from 'react';
import useSWR from 'swr';
import { useApplicationState } from 'src/store/applicationState';
import ApplicationInterface from 'src/types/application-interface';
import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';
import { ApiError } from '../utils/apiErrors';

export function useGetApplicationsAll() {
  const { error, data, isLoading } = useSWR(urls.dashboards.list, apiFetcher, {});

  // This is a custom hook that sets the dashboards and update it in real time in the store
  const setApplications = useApplicationState((state) => state.setApplications);

  useEffect(() => {
    if (data) {
      setApplications(data as ApplicationInterface[]);
    }
  }, [data, setApplications]);

  return {
    error: error as ApiError,
    data: data as ApplicationInterface[],
    isLoading,
  };
}
