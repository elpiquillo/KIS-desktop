import { useState } from 'react';
import { t } from 'i18next';
import { useGetDashboardAccessesAll } from 'src/apis/dashboard-access';

import { Box } from '@mui/material';
import HeaderSearch from 'src/components/header-search';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { getTestId } from 'src/utils/data-test-id.helper';
import ApplicationsList from './apps-list';

export default function HomeView() {
  const dashboardStateData = useDashboardAccessState((state) => state.applications);
  const { data, isLoading } = useGetDashboardAccessesAll(
    dashboardStateData === undefined || dashboardStateData.length === 0
  );

  const [searchValue, setSearchValue] = useState('');

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
