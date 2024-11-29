import DashboardAccessInterface from 'src/types/dashboard-access-interface';

export const sortApplicationsByFavorite = (applicationList: DashboardAccessInterface[]) => {
  const applicationListToSort = applicationList;
  applicationListToSort.sort((firstApp, secondApp) => {
    const favoriteA = !!firstApp.favorite;
    const favoriteB = !!secondApp.favorite;

    return Number(favoriteB) - Number(favoriteA);
  });
  return applicationListToSort;
};
