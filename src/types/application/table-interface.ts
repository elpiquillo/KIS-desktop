import { ButtonAction, DataQuery, QueriesDispatch } from '../queries-interface';
import { DataValue } from './input-form-interface';

export interface TableData {
  card_title: string;
  columns: {
    id: string;
    index: number;
    name: string;
  }[];
  action: any[];
  button_export: boolean;
  button_action: ButtonAction[];
  allow_filters: boolean;
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
}

export type TableFinalData = TableData & {
  columns_content: {
    id: string;
    content: {
      column_id: string;
      column_content: DataValue;
    }[];
  }[];
};
