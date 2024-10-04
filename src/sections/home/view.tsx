import { useState } from 'react';
import { t } from 'i18next';
import { useGetDashboardAccessesAll } from 'src/apis/dashboard-access';

import { Box } from '@mui/material';
import HeaderSearch from 'src/components/header-search';
import ApplicationsList from './apps-list';

export default function HomeView() {
  const { data, isLoading } = useGetDashboardAccessesAll();
  const [searchValue, setSearchValue] = useState('');

  return (
    <ApplicationsList
      title={`${t('global.welcomeUser', { name: 'Jo' })}`}
      applications={data}
      loading={isLoading}
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
