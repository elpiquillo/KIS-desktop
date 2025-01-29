import { t } from 'i18next';
import { useEffect } from 'react';
import useSWR from 'swr';

import { useDashboardState } from 'src/store/dashboardState';
import { DashboardContent } from 'src/types/dashboard-interface';
import { DashboardPageCreate, PageInterface } from 'src/types/page-interface';

import { ApiError } from '../utils/apiErrors';
import { apiFetcher } from '../utils/fetchers';
import { urls } from '../utils/urls';

export function useGetDashboardPage({
  dashboardId,
  pageId,
}: {
  dashboardId: string;
  pageId: string;
}) {
  const { setDashboard } = useDashboardState();
  const getDashboard = useDashboardState((s) => s.dashboard);

  const urlQuery = `${urls.dashboards.page.get}?dashboard_id=${dashboardId}&path=${pageId}`;
  const { error, data, isLoading } = useSWR(urlQuery, apiFetcher, {});

  useEffect(() => {
    if (data) {
      // const pages = (getDashboard?.pages?.pages || []).map((curpage: any) =>
      //   curpage._id?.$oid === (data as any)._id?.$oid ? data : curpage
      // );
      const dashboard = {
        ...getDashboard,
        pages: { pages: data },
      };

      setDashboard(dashboard as DashboardContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    error: error as ApiError,
    data: data as DashboardContent,
    isLoading,
  };
}
