import { t } from 'i18next';
import {
  PatchDataHandlersInterface,
  UpdateDataHandlersInterface,
} from 'src/types/data-handler-interface';
import { DataQuery, Document } from 'src/types/queries-interface';
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

export function useCreateDataHandlers(query: DataQuery) {
  const createDataHandlers = async ({ pageId, documents }: UpdateDataHandlersInterface) => {
    try {
      const res = await apiFetcher(urls.dataHandlers.create, {
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
      return res;
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { createDataHandlers };
}

export function useUpdateDataHandlers(query?: DataQuery) {
  const updateDataHandlers = async ({ pageId, documents }: UpdateDataHandlersInterface) => {
    try {
      const res = await apiFetcher(`${urls.dataHandlers.update}1`, {
        method: 'PUT',
        body: JSON.stringify({
          data_handler: {
            query_id: query?.id,
            collection_name: query?.collection_name,
            page_id: pageId,
            documents,
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

export function usePatchDataHandlers() {
  const patchDataHandlers = async ({
    pageId,
    collectionName,
    documents,
  }: PatchDataHandlersInterface) => {
    try {
      const res = await apiFetcher(`${urls.dataHandlers.update}1`, {
        method: 'PATCH',
        body: JSON.stringify({
          data_handler: {
            page_id: pageId,
            collection_name: collectionName,
            documents,
          },
        }),
      });
      return res;
    } catch (error: any) {
      throw new Error(t(`errors.${error.message}`));
    }
  };

  return { patchDataHandlers };
}
