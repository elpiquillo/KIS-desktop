export interface MenuData {
  c_at: string;
  u_at: string;
  company_id: string;
  content: MenuItemData[];
  dashboard_id: string;
  _id: {
    $oid: string;
  };
}

export interface MenuItemData {
  id: string;
  is_title: boolean;
  visible: boolean;
  menu_item_url: {
    icon_name: string;
    text: string;
    url: string;
  };
}