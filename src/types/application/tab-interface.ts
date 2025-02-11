import { ContainerInterface } from './general-interface';

export interface TabData {
  full_width: boolean;
  tab_content: {
    id: string;
    title: string;
    container: ContainerInterface;
  }[];
}
