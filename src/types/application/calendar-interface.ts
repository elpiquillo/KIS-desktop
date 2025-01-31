import { ButtonAction, DataQuery, QueriesDispatch } from '../queries-interface';

export interface CalendarData {
  card_title: string;
  event_content: {
    id: string;
    title: string;
  }[];
  is_editable: boolean;
  button_action: ButtonAction[];
  queries: DataQuery[];
  queries_dispatch: QueriesDispatch[];
  content: string;
  event_color: string;
  event_end: string;
  event_preview: string;
  event_start: string;
}
