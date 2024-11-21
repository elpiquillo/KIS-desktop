import { ButtonAction } from '../queries-interface';

export interface FinalData {
  card_title: string;
  description: string;
  card_content: {
    id: string;
    index: number;
    name: string;
    content: string;
    title: string;
  }[];
  image?: string;
  button_action: ButtonAction[];
}
