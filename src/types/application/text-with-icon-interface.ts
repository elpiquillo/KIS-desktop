import { DataQuery, QueriesDispatch } from '../queries-interface';

export interface TextWithIconData {
  data: {
    queries: DataQuery[];
    queries_dispatch: QueriesDispatch[];
    title: string;
    description: string;
    icon: string;
  };
}
