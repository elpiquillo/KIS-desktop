import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';


import { useGetDashboardAccessesAll } from 'src/apis/dashboard-access';
import HeaderSearch from 'src/components/header-search';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { useGlobalState } from 'src/store/globalState';
import ApplicationsList from './apps-list';

export default function HomeView() {
  const dashboardStateData = useDashboardAccessState((state) => state.applications);
  const { showAllApplications } = useGlobalState((state) => state);
  const { setShowAllApplications } = useGlobalState((state) => state);

  const { data, isLoading } = useGetDashboardAccessesAll(
    dashboardStateData === undefined || dashboardStateData.length === 0
  );

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (searchValue !== '' && !showAllApplications) {
      setShowAllApplications(true);
    }
  }, [searchValue, showAllApplications, setShowAllApplications]);

  return (
    <ApplicationsList
      title={`${t('global.welcomeUser', { name: 'Jo' })}`}
      applications={dashboardStateData.length > 0 ? dashboardStateData : data}
      loading={dashboardStateData.length > 0 ? false : isLoading}
      searchValue={searchValue}
      headerActions={
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <HeaderSearch
            value={searchValue}
            placeholder={t('global.searchByName')}
            onSubmit={setSearchValue}
          />
        </Box>
      }
    />
  );
}
