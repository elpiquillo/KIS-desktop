import { DataQuery, QueriesDispatch } from '../queries-interface';

export interface BreadcrumbData {
  current_page: string;
  right_links: {
    page_name: string;
    page_link: string;
    id?: number;
    index?: number;
  }[];
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
  size?: number;
}
