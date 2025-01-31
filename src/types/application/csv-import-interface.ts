import { DataQuery, QueriesDispatch } from '../queries-interface';

export interface CsvImportData {
  card_title: string;
  sub_title: string;
  document_header: boolean;
  fields: {
    field_name: string;
    row: string;
  }[];
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
}
