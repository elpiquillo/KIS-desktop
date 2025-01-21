export interface TabData {
  data: {
    tab_content: {
      id: string;
      title: string;
      container: {
        id: string;
        row: any[];
      };
    }[];
  };
}
