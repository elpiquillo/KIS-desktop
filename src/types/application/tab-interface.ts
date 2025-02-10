import { ContainerInterface } from './general-interface';

export interface TabData {
  tab_content: {
    id: string;
    title: string;
    container: ContainerInterface;
  }[];
}
