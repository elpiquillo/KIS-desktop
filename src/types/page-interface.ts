import { ContainerInterface } from './application/general-interface';

export interface PagesData {
  company_id: string;
  dashboard_id: string;
  name: string;
  status: string;
  data_params: [];
  structure: [];
  c_at?: string;
  u_at?: string;
  _id?: {
    $oid: string;
  };
}

export interface PageInterface {
  page: {
    _id: {
      $oid: string;
    };
    structure: ContainerInterface[];
  };
}

export interface DashboardPageCreate {
  page: {
    name: string;
    dashboard_id: string | undefined;
  };
}
