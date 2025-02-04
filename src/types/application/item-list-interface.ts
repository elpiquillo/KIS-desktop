import { ButtonAction, DataQuery, QueriesDispatch } from '../queries-interface';

export interface ItemListData {
  card_title: string;
  description: string;
  card_content: {
    id: string;
    index: number;
    name: string;
    content: string;
    title: string;
  }[];
  button_action: ButtonAction[];
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
  image?: {
    file_name: string;
    original: string;
    thumbnail: string;
  };
}

export interface ItemListFinalData {
  card_title: string;
  description: string;
  card_content: ItemListData['card_content'];
  button_action: ButtonAction[];
  image?: ItemListData['image'];
}
