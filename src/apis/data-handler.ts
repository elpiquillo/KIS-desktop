import { t } from 'i18next';
import { DataQuery } from 'src/types/queries-interface';
import { apiFetcher } from 'src/utils/fetchers';
import { urls } from 'src/utils/urls';

export function useGetDataHandlersList() {
  const getDataHandlers = async (queries: DataQuery[]) => {
    try {
      const res = await apiFetcher(urls.dataHandlers.list, {
        method: 'POST',
        body: JSON.stringify({
          data_handler: { queries },
        }),
      });
      return res;
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { getDataHandlers };
}

export function useCreateDataHandlers(query?: DataQuery) {
  const createDataHandlers = async ({
    pageId,
    documents,
  }: {
    pageId: string;
    documents: any[];
  }) => {
    try {
      await apiFetcher(urls.dataHandlers.create, {
        method: 'POST',
        body: JSON.stringify({
          data_handler: {
            query_id: query?.id,
            collection_name: query?.collection_name,
            page_id: pageId,
            documents,
          },
        }),
      });
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { createDataHandlers };
}

export function useUpdateDataHandlers(query?: DataQuery) {
  const updateDataHandlers = async ({ pageId, document }: { pageId: string; document: any }) => {
    try {
      const res = await apiFetcher(`${urls.dataHandlers.update}1`, {
        method: 'PUT',
        body: JSON.stringify({
          data_handler: {
            query_id: query?.id,
            collection_name: query?.collection_name,
            page_id: pageId,
            documents: [document],
          },
        }),
      });
      return res;
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { updateDataHandlers };
}
