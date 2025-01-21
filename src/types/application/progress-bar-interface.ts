import { DataQuery, QueriesDispatch } from '../queries-interface';

export interface ProgressBarData {
  data: {
    card_title: string;
    sub_title: string;
    force_percent: string;
    devise: string;
    first_value: number;
    second_value: number;
    queries: DataQuery[];
    queries_dispatch: QueriesDispatch[];
  };
}
