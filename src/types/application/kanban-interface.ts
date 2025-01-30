import { ButtonAction, DataQuery, QueriesDispatch } from '../queries-interface';

export interface CardOrigin {
  _id: { $oid: string };
  content: string;
  project_label_blue: string;
  project_label_red: string;
  project_label_yellow: string;
  project_label_green: string;
  project_status: string;
  project_id: number;
  c_at: string;
  u_at: string;
  user_id: string;
}

export interface KanbanData {
  data: {
    allow_card_edit: boolean;
    allow_card_create: boolean;
    allow_card_drag: boolean;
    allow_card_destroy: boolean;
    preview_text: string;
    card_origin: string | CardOrigin[];
    button_action: ButtonAction[];
    card_content: {
      id: string;
      index: number;
      title: string;
      name: string;
      content: string;
    }[];
    columns: {
      id: number;
      title: string;
    }[];
    queries: DataQuery[];
    queries_dispatch: QueriesDispatch[];
  };
}
