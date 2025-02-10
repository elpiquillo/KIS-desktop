import { ContainerInterface } from './general-interface';

export interface TabWithIconData {
  tab_content: {
    id: string;
    title: string;
    icon: string;
    container: ContainerInterface;
  }[];
}
