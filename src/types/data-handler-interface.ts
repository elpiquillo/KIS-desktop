import { Document } from 'src/types/queries-interface';

export interface UpdateDataHandlersInterface {
  pageId: string;
  documents: Document[];
}

export interface PatchDataHandlersInterface {
  pageId: string;
  collectionName: string;
  documents: Document[];
}
