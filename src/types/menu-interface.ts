export interface MenuItem {
  id?: string;
  is_title: boolean;
  visible?: boolean;
  menu_item_url?: MenuItemUrl;
}

export interface MenuItemUrl {
  text: string;
  icon_name: string;
  url: string;
}
