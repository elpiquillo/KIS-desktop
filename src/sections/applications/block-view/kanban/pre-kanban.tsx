/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useRef, useState } from 'react';
import { DataQuery } from 'src/types/queries-interface';
import { useGetDataHandlersList } from 'src/apis/data-handler';
import KanbanView from '../kanban';
import PageDataInCheck from './pageDataInCheck';
import cable from './cable';

interface Props {
  blockInfo: any;
}

export default function PreKanban({ blockInfo }: Props) {
  const { getDataHandlers } = useGetDataHandlersList(blockInfo.blocs[0].id);
  const {
    data: { queries, queries_dispatch },
  } = blockInfo.blocs[0];

  const path = window.location.href;
  const slplitPath = path.substring(path.lastIndexOf('/') + 1);

  const [toLoad, setToLoad] = useState(true);

  const wss = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (toLoad && queries?.length && queries_dispatch?.length) {
      const tempQueries: DataQuery[] = [];

      queries.forEach((q: any) => {
        const dataFilters = () => {
          if (q.filters) {
            const filtersJSON = JSON.stringify(q.filters);
            const d_i = PageDataInCheck(filtersJSON, '');

            return JSON.parse(d_i);
          }
          return q.filters;
        };

        const filters = dataFilters();

        const query = {
          id: q.id,
          url: q.url,
          page_id: q.page_id || slplitPath,
          collection_name: q.collection_name,
          limit: q.limit,
          filters,
          special_filters: q.special_filters || [],
        };

        tempQueries.push(query);
      });

      if (tempQueries.length) {
        getDataHandlers(tempQueries);
      }
    }
  }, [toLoad, queries, queries_dispatch, slplitPath, getDataHandlers]);

  useEffect(() => {
    wss.current = cable(
      JSON.stringify({
        channel: 'DataHandlerChannel',
        page_id: slplitPath,
      })
    );

    const wsCurrent = wss.current;

    return () => {
      wsCurrent.close();
    };
  }, [queries, queries_dispatch, slplitPath]);

  if (!toLoad) {
    if (!wss) return {};
    wss.current!.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.message?.action === 'FETCH DATA') {
        queries_dispatch.forEach((qd: any) => {
          const findQ = queries.find((qs: any) => qs.id === qd.query_id);
          if (findQ!.collection_name === message.message.collection) {
            return setToLoad(true);
          }
          return null;
        });
      }
    };
  }

  return <KanbanView blockInfo={blockInfo} />;
}
