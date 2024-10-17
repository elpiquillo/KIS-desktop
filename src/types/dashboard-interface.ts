import { MenuData } from './dashboard-menu-interface';
import { PagesData } from './page-interface';

export interface DashboardContent {
  dashboard: {
    dashboard: DashboardInfoData;
  };
  pages: {
    pages: PagesData[];
  };
}

export interface DashboardInfoData {
  _id: {
    $oid: string;
  };
  c_at: string;
  company_id: string;
  description: string;
  logo: string;
  name: string;
  status: string;
  u_at: string;
  structure: any[];
}

export interface MenuContextProps {
  menu: MenuData | any;
}

export interface DashboardCreate {
  name: string;
  description: string;
}

export interface DashboardUpdate {
  name: string;
  description: string;
  id: string;
  pages?: any;
}

export interface DashboardDelete {
  id: string;
}

export interface DashboardId {
  dashboardId: string | undefined;
}
