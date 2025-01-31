import { DataQuery, QueriesDispatch } from '../queries-interface';

export interface BreadcrumbData {
  size?: number;
  current_page: string;
  right_links: {
    id?: number;
    page_name: string;
    page_link: string;
    index?: number;
  }[];
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
}
