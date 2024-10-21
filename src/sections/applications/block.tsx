/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { useGetDataHandlersList } from 'src/apis/data-handler';
import { DataQuery } from 'src/types/queries-interface';

import { BlockViewByComponentType } from './block-view/constants';
import cable from './helpers/cable';
import PageDataInCheck from './helpers/pageDataInCheck';

interface Props {
  block: any;
}

export default function Block({ block }: Props) {
  const { getDataHandlers } = useGetDataHandlersList(block.id);
  const {
    data: { queries, queries_dispatch },
  } = block.blocs[0];

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

      setToLoad(false);

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

    if (!toLoad) {
      if (wss)
        wss.current!.onmessage = (e) => {
          const message = JSON.parse(e.data);
          if (message.message?.action === 'FETCH DATA') {
            const flag = queries_dispatch.some((qd: any) => {
              const findQ = queries.find((qs: any) => qs.id === qd.query_id);
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

  return <View blockInfo={block} />;
}
