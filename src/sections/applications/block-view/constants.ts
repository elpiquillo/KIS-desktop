import { BlockInterface } from 'src/types/application/general-interface';
import { CustomFilter, DataQuery, QueryResult } from 'src/types/queries-interface';
import AreaChartView from './areaChart';
import BreadcrumbView from './breadcrumb';
import CalendarView from './calendar/calendar';
import CsvImportView from './csv-import/csv-import';
import DefaultView from './default';
import GaugeView from './gauge';
import { GenericChartView } from './generic-chart/genericChart';
import InputFormView from './input-form/input-form';
import ItemListView from './item-list/item-list';
import KanbanView from './kanban/kanban';
import ProgressBarView from './progress-bar';
import TabView from './tab';
import TabWithIconView from './tab-with-icon';
import TableView from './table/table';
import TextWithIconView from './text-with-icon';

export enum ComponentType {
  BC = 'BC',
  IF = 'IF',
  LB = 'LB',
  TAB = 'TAB',
  TABI = 'TABI',
  FORM = 'FORM',
  PL = 'PL',
  KB = 'KB',
  CLD = 'CLD',
  UPCSV = 'UPCSV',
  GG = 'GG',
  PBS = 'PBS',
  RB = 'RB',
  PIE = 'PIE',
  DONUT = 'DONUT',
  AREA = 'AREA',
}

export const BlockViewByComponentType: Record<
  ComponentType | 'default',
  {
    content: React.FC<{
      blockInfo: BlockInterface;
      handleGetHandlers: (props: { additionalFilters?: CustomFilter[]; page?: number }) => Promise<{
        queriesRequest: DataQuery[];
        queriesResponse: QueryResult[];
      }>;
    }>;
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
  [ComponentType.TAB]: {
    content: TabView,
  },
  [ComponentType.TABI]: {
    content: TabWithIconView,
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
  [ComponentType.RB]: {
    content: GenericChartView,
  },
  [ComponentType.PIE]: {
    content: GenericChartView,
  },
  [ComponentType.DONUT]: {
    content: GenericChartView,
  },
  [ComponentType.AREA]: {
    content: AreaChartView,
  },
  default: {
    content: DefaultView,
  },
};
