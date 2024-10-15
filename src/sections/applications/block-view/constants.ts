import BreadcrumbView from './breadcrumb';
import CalendarView from './calendar';
import CsvImportView from './csv-import';
import DefaultView from './default';
import GaugeView from './gauge';
import InputFormView from './input-form';
import ItemListView from './item-list';
import KanbanView from './kanban';
import ProgressBarView from './progress-bar';
import TableView from './table';
import TextWithIconView from './text-with-icon';

export enum ComponentType {
  BC = 'BC',
  IF = 'IF',
  LB = 'LB',
  FORM = 'FORM',
  PL = 'PL',
  KB = 'KB',
  CLD = 'CLD',
  UPCSV = 'UPCSV',
  GG = 'GG',
  PBS = 'PBS',
}

export const BlockViewByComponentType: Record<
  string,
  {
    content: any;
  }
> = {
  [ComponentType.BC]: {
    content: BreadcrumbView,
  },
  [ComponentType.IF]: {
    content: TextWithIconView,
  },
  [ComponentType.LB]: {
    content: ItemListView,
  },
  [ComponentType.FORM]: {
    content: InputFormView,
  },
  [ComponentType.PL]: {
    content: TableView,
  },
  [ComponentType.KB]: {
    content: KanbanView,
  },
  [ComponentType.CLD]: {
    content: CalendarView,
  },
  [ComponentType.UPCSV]: {
    content: CsvImportView,
  },
  [ComponentType.GG]: {
    content: GaugeView,
  },
  [ComponentType.PBS]: {
    content: ProgressBarView,
  },
  default: {
    content: DefaultView,
  },
};
