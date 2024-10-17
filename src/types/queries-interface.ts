import { AxiosError } from 'axios';

export type FilterOperator = 'eq' | 'like' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte';

export interface Query {
  id: string;
  url: string;
  page_id: string;
  collection_name: string;
  limit: number;
  filters: {
    filter_column: string;
    filter_operator: FilterOperator;
    filter_value: string;
  }[];
  special_filters: {
    alias: string;
    field_name: string;
    type: '$group' | '$sum' | '$max' | '$min' | '$asc' | '$desc' | '$avg' | '$first' | '$last';
  }[];
}

export type Filter = Query['filters'][number];
export type SpecialFilter = Query['special_filters'][number];

export interface Queriesdispatch {
  query_id: string;
  destination_fields: {
    preview_text?: string;
    card_content?: {
      content: string;
      id: string;
    }[];
    columns: {
      id: string;
      content: string;
      target?: string;
    }[];
  }[];
}

export interface ButtonAction {
  index: number;
  id: string;
  page_id: string;
  text: string;
  name: string;
  button_color: string;
}
export interface ApiDataHandlerResponse {
  queries: {
    query_id: string;
    pages: {
      current_page: number;
      max_page: number;
    };
    documents_size: number;
    documents: {
      _id: {
        $oid: string;
      };
      c_at: string;
      u_at: string;
      [key: string]: any;
    }[];
  }[];
}

export type Document = ApiDataHandlerResponse['queries'][number]['documents'][number];

export type QueryResult = ApiDataHandlerResponse['queries'][number];

export interface CustomFilterNotEmpty extends Filter {
  query_id?: string;
}

export type CustomFilter = CustomFilterNotEmpty | 'empty_filters';

export type DataQuery = {
  id: string;
  url: string;
  page_id: string;
  collection_name: string;
  limit: number;
  page?: number | null;
  filters: CustomFilter[] | null;
  special_filters: SpecialFilter[];
};

export type DataLinkQuery = {
  data_handler: {
    queries: DataQuery[];
  };
};

export interface ApiErrorContent {
  errors?: string[];
}

export type ApiError = AxiosError<ApiErrorContent> | 'CANCELED';
