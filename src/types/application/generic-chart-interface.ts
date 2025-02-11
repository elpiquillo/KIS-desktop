import { DataQuery, QueriesDispatch } from '../queries-interface';

export interface GenericChartData {
  card_title: string;
  sub_title: string;
  total: number;
  series: {
    id: string;
    label: string;
    value: number;
    color: string;
  }[];
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
}
