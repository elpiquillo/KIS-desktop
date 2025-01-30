import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetDataHandlersList } from 'src/apis/data-handler';
import { ApiDataHandlerResponse } from 'src/types/queries-interface';

// Subscribe Bank, allow a component to be registered here
// First level key is collection + id
// Second level is uniq id for each component using useDataLink
const subscribed: {
  [key: string]: {
    [key: string]: {
      refresh: () => void;
    };
  };
} = {};

// Cache to store current request for same document
// Avoid multiple components on the same page to repeat the same request on the same time.
const currentRequests: {
  [key: string]: Promise<any>;
} = {};

/**
 * Refresh all component using data_link associated with this collection and document ID
 */
export const refreshDataLink = (collection: string, _id: string) => {
  try {
    const subscribedKey = `${collection}_${_id}`;
    if (subscribed[subscribedKey]) {
      Object.values(subscribed[subscribedKey]).forEach((component) => {
        component.refresh();
      });
    }
  } catch (e) {
    // console.log(e);
  }
};

/**
 * To use Datalink, the page must be reached with a <Link> setting the state to a particular value, it must contain
 * collection, _id, page, queryId
 * Those are the value needed to fetch the request to display the component containing the click button to go to this page.
 */
export const useDataLink = () => {
  const location = useLocation();
  const [data, setData] = useState<{
    data: ApiDataHandlerResponse['queries'][number]['documents'][number];
  } | null>();
  const [ready, setReady] = useState(false);
  const subscribedId = useRef(new Date().getTime().toString());
  const subscribedKey = useRef('');

  const { getDataHandlers } = useGetDataHandlersList();

  useEffect(() => {
    const cursubscribedId = subscribedId.current;
    if (location.state && location.state.data && location.state.data.query && !data) {
      const { collection, id, query } = location.state.data;
      subscribedKey.current = `${collection}_${id}`;
      const request = () => {
        const result = getDataHandlers(query);
        // Add the request to the cache to avoid multiple same request on the same page my multiple components
        if (!currentRequests[subscribedKey.current]) {
          currentRequests[subscribedKey.current] = result;
          result.finally(() => {
            delete currentRequests[subscribedKey.current];
          });
        }
        return result;
      };
      // Fetch the data from the server
      const refresh = () => {
        const result = currentRequests[subscribedKey.current] || request();
        result
          .then((response: ApiDataHandlerResponse) => {
            const res = (() => {
              const resAfterMap = response.queries
                .map((q: any) => q.documents.find((e: any) => e._id.$oid === id))
                .find((r: any) => r !== undefined);
              return resAfterMap ? { data: resAfterMap } : null;
            })();
            setData(res);
            setReady(true);
          })
          .catch((e) => {
            // console.log(e);
          });
      };
      // Add the component to the subsribe bank so if another component update the document
      // It can request to refresh all component which are using this document.
      if (!subscribed[subscribedKey.current]) {
        subscribed[subscribedKey.current] = {};
      }
      subscribed[subscribedKey.current][cursubscribedId] = {
        refresh,
      };
      refresh();
    } else {
      setReady(true);
    }
  }, [data, getDataHandlers, location.state]);

  // When component is gone for good, we remove it from the subscribe bank.
  useEffect(() => {
    const cursubscribedId = subscribedId.current;
    return () => {
      if (subscribedKey.current && subscribed[subscribedKey.current]) {
        if (subscribed[subscribedKey.current][cursubscribedId]) {
          delete subscribed[subscribedKey.current][cursubscribedId];
        }
        if (Object.keys(subscribed[subscribedKey.current]).length === 0) {
          delete subscribed[subscribedKey.current];
        }
      }
    };
  }, []);

  return { data_link: data, data_link_ready: ready };
};
