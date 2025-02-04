import { DataQuery, QueriesDispatch } from '../queries-interface';

export interface AreaChartData {
  card_title: string;
  sub_title: string;
  categories: string[];
  series: {
    data: {
      id: string;
      label: string;
      color: string;
      data: number[];
      description: {
        query_id: string;
        column: string;
      };
    }[];
  }[];
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
}
