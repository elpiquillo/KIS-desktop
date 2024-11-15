import { t } from 'i18next';
import { useDashboardState } from 'src/store/dashboardState';
import { DataQuery } from 'src/types/queries-interface';
import { apiFetcher } from 'src/utils/fetchers';
import { urls } from 'src/utils/urls';

export function useGetDataHandlersList(blockId: string) {
  const { setDashboardByDataHandlers } = useDashboardState();

  const getDataHandlers = async (queries: DataQuery[]) => {
    try {
      const res = await apiFetcher(urls.dataHandlers.list, {
        method: 'POST',
        body: JSON.stringify({
          data_handler: { queries },
        }),
      });

      setDashboardByDataHandlers(blockId, res);
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { getDataHandlers };
}

export function useCreateDataHandlers(query?: DataQuery) {
  const createDataHandlers = async ({ pageId, document }: { pageId: string; document: any }) => {
    try {
      await apiFetcher(urls.dataHandlers.create, {
        method: 'POST',
        body: JSON.stringify({
          data_handler: {
            query_id: query?.id,
            collection_name: query?.collection_name,
            page_id: pageId,
            documents: [document],
          },
        }),
      });
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { createDataHandlers };
}
