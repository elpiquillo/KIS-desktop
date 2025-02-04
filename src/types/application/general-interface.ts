export type BlockInterface<T = any> = {
  id: string;
  container: string;
  blocs: {
    id: string;
    bloc_id: string;
    data: T;
    bloc_size?: number;
    blocs?: any[];
  }[];
};

export interface ContainerInterface {
  id: string;
  row: {
    id: string;
    col: number;
    blocs: BlockInterface[];
  }[];
}
