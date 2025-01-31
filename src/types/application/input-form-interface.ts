import { DataQuery, QueriesDispatch } from '../queries-interface';

interface ValidateContent {
  active: boolean;
  value: string | number;
  errorMessage: string;
}

export type FieldType =
  | 'email'
  | 'checkbox'
  | 'number'
  | 'text'
  | 'select'
  | 'date'
  | 'date-time'
  | 'image'
  | 'document'
  | 'text-area'
  | 'plain-text'
  | 'hidden-field';

export type DataValueFile = {
  file_name: string;
  alt: string;
  original: string;
  thumbnail?: string;
};

export type DataValue = DataValueFile | string | number;

export interface InputFormData {
  title: string;
  type: string;
  document_id?: any;
  fields: {
    name: string;
    label: string;
    title: string;
    value: DataValue;
    file_name?: string;
    alt?: string;
    original?: string;
    options?: {
      name: string;
      value: string;
    }[];
    type: FieldType;
    validate: {
      required: {
        active: boolean;
        value: boolean;
        errorMessage: string;
      };
      pattern?: ValidateContent;
      minLength: ValidateContent;
      maxLength: ValidateContent;
    };
    condition?: {
      active: boolean;
      target: string;
      type: string;
      value: string;
      activation: string;
      checked?: 'true' | 'false';
    };
  }[];
  submit: {
    button: string;
    url: string;
    column: number;
    httpAction: string;
    collection: string;
  };
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
}

export type FieldData = InputFormData['fields'][number];
