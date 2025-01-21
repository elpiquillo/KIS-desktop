import { ButtonAction, DataQuery, QueriesDispatch } from '../queries-interface';

export interface GaugeData {
  data: {
    card_title: string;
    sub_title: string;
    devise: string;
    bottom_text: string;
    middle_text: string;
    graph_label: string;
    first_value: number;
    second_value: number;
    show_percent: boolean;
    force_percent: boolean;
    button_action: ButtonAction[];
    queries: DataQuery[];
    queries_dispatch: QueriesDispatch[];
  };
}
