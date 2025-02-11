import { ContainerInterface } from './general-interface';

export interface TabWithIconData {
  full_width: boolean;
  tab_content: {
    id: string;
    title: string;
    icon: string;
    container: ContainerInterface;
  }[];
}
