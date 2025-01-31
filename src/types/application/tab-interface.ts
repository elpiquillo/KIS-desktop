export interface TabData {
  tab_content: {
    id: string;
    title: string;
    container: {
      id: string;
      row: any[];
    };
  }[];
}
