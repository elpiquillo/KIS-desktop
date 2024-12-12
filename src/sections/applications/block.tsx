import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGetDataHandlersList } from 'src/apis/data-handler';
import { CustomFilter, DataQuery, QueriesDispatch, QueryResult } from 'src/types/queries-interface';
import { useDataLink } from 'src/hooks/use-data-link';
import { BlockViewByComponentType } from './block-view/constants';
import cable from './helpers/cable';
import PageDataInCheck from './helpers/pageDataInCheck';

interface Props {
  block: any;
}

export default function Block({ block }: Props) {
  const {
    data: { queries, queries_dispatch },
  } = block.blocs[0];
  const path = window.location.href;
  const slplitPath = path.substring(path.lastIndexOf('/') + 1);

  const [toLoad, setToLoad] = useState(true);
  const wss = useRef<WebSocket | null>(null);

  const { data_link, data_link_ready } = useDataLink();
  const { getDataHandlers } = useGetDataHandlersList();

  const handleGetHandlers = useCallback(
    async ({ additionalFilters, page }: { additionalFilters?: CustomFilter[]; page?: number }) => {
      if (data_link_ready) {
        const queriesRequest: DataQuery[] = [];

        queries.forEach((q: DataQuery) => {
          const dataFilters = () => {
            if (q.filters) {
              const filtersJSON = JSON.stringify(q.filters);
              const d_i = PageDataInCheck(filtersJSON, data_link);

              return JSON.parse(d_i);
            }
            return q.filters;
          };

          const filters = dataFilters();

          const query = {
            id: q.id,
            url: q.url,
            page: page || q.page || 1,
            page_id: q.page_id || slplitPath,
            collection_name: q.collection_name,
            limit: q.limit,
            filters: [...filters, ...(additionalFilters || [])],
            special_filters: q.special_filters || [],
          };

          queriesRequest.push(query);
        });

        setToLoad(false);

        if (queriesRequest.length) {
          const result = await getDataHandlers(queriesRequest);
          return { queriesRequest, queriesResponse: result?.queries };
        }

        return { queriesRequest: [], queriesResponse: [] };
      }
      return { queriesRequest: [], queriesResponse: [] };
    },
    [data_link, data_link_ready, getDataHandlers, queries, slplitPath]
  );

  useEffect(() => {
    if (toLoad && queries?.length && queries_dispatch?.length) {
      handleGetHandlers({});
    }
  }, [handleGetHandlers, queries, queries_dispatch, slplitPath, toLoad]);

  useEffect(() => {
    wss.current = cable(
      JSON.stringify({
        channel: 'DataHandlerChannel',
        page_id: slplitPath,
      })
    );

    const wsCurrent = wss.current;

    if (!toLoad) {
      if (wss)
        wss.current!.onmessage = (e) => {
          const message = JSON.parse(e.data);
          if (message.message?.action === 'FETCH DATA') {
            const flag = queries_dispatch.some((qd: QueriesDispatch) => {
              const findQ = queries.find((qs: DataQuery) => qs.id === qd.query_id);
              return findQ!.collection_name === message.message.collection;
            });
            setToLoad(flag);
          }
        };
    }

    return () => {
      wsCurrent.close();
    };
  }, [queries, queries_dispatch, slplitPath, toLoad]);

  const { content: View } = BlockViewByComponentType[block?.blocs?.[0]?.bloc_id || 'default'];

  return <View blockInfo={block} handleGetHandlers={handleGetHandlers} />;
}
