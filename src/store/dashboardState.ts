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
      const copyDashboard = JSON.parse(JSON.stringify(state.dashboard));
      const structure: any[] = copyDashboard?.pages.pages[0].structure || [];
      const indexes = getIndexesForBlockById(blockId, structure);
      const blockData =
        structure?.[indexes.containerIndex]?.row[indexes.rowIndex]?.blocs[indexes.blockIndex]
          .blocs[0].data;
      if (indexes.containerIndex !== -1) {
        const result = dispatchFetchedData({
          dataQueries: data.queries,
          dispatchQueries: blockData.queries_dispatch,
          blockData,
        });
        structure[indexes.containerIndex].row[indexes.rowIndex].blocs[
          indexes.blockIndex
        ].blocs[0].data = result;
        copyDashboard.pages.pages[0] = {
          ...copyDashboard.pages.pages[0],
          structure: [...structure],
        };
      }
      return { dashboard: copyDashboard };
    }),
}));
