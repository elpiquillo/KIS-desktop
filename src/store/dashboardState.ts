import DashboardAccessInterface from 'src/types/dashboard-access-interface';
import { DashboardContent } from 'src/types/dashboard-interface';
import { MenuData } from 'src/types/dashboard-menu-interface';
import { ApiDataHandlerResponse } from 'src/types/queries-interface';
import { create } from 'zustand';
import dispatchFetchedData from 'src/store/helpers/dispatchFetchedData';
import { getIndexesForBlockById } from './helpers/getIndexesForBlockById';

interface DashboardState {
  dashboard?: DashboardContent;
  dashboardsAll?: DashboardAccessInterface[];
  dashboardMenu?: MenuData;
  setDashboardsAll: (value: DashboardAccessInterface[] | undefined) => void;
  setDashboard: (value: DashboardContent | undefined) => void;
  setDashboardMenu: (value: MenuData | undefined) => void;
  setDashboardByDataHandlers: (blockId: string, data: ApiDataHandlerResponse) => void;
}

export const useDashboardState = create<DashboardState>()((set) => ({
  dashboardsAll: undefined,
  dashboard: undefined,
  dashboardMenu: undefined,
  setDashboardsAll: (value) => set(() => ({ dashboardsAll: value })),
  setDashboard: (value) => set(() => ({ dashboard: value })),
  setDashboardMenu: (value) => set(() => ({ dashboardMenu: value })),
  setDashboardByDataHandlers: (blockId, data) =>
    set((state) => {
      const start = state.dashboard;
      const structure = state.dashboard?.dashboard.structure;
      const indexes = getIndexesForBlockById(blockId, structure);
      const blockData =
        structure[indexes.containerIndex]?.row[indexes.rowIndex]?.blocs[indexes.blockIndex].blocs[0]
          .data;
      const result = dispatchFetchedData({
        dataQueries: data.queries,
        dispatchQueries: blockData.queries_dispatch,
        blockData,
      });
      // console.log('result', result);
      return { dashboard: start };
    }),
}));
