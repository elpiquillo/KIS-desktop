import { t } from 'i18next';

import { Box, Button, Divider, Grid } from '@mui/material';
import DashboardAccessInterface from 'src/types/dashboard-access-interface';
import { useGlobalState } from 'src/store/globalState';

import { getTestId } from 'src/utils/data-test-id.helper';
import ApplicationCardItem from './application-card-item';

interface ApplicationsCardProps {
  applications?: DashboardAccessInterface[];
}

export default function ApplicationCards({ applications }: ApplicationsCardProps) {
  const favoriteApplications = applications?.filter((app) => app.favorite && app.id.display);
  const otherApplications = applications?.filter((app) => !app.favorite && app.id.display);
  const { showAllApplications } = useGlobalState((state) => state);

  const toogleShowApplications = () => {
    useGlobalState.setState({ showAllApplications: !showAllApplications });
  };

  const renderApplications = (apps: DashboardAccessInterface[]) =>
    apps?.map((application) => (
      <Grid
        {...getTestId('application-card-item-grid')}
        item
        key={application.id.id}
        xs={12}
        sm={6}
        md={4}
        lg={3}
      >
        <ApplicationCardItem application={application} />
      </Grid>
    ));

  return (
    <Box>
      <Grid {...getTestId('application-grid')} container spacing={3} p={3}>
        {renderApplications(favoriteApplications || [])}
      </Grid>

      <Divider aria-hidden="true" sx={{ opacity: 0.5, m: 2 }}>
        <Button onClick={() => toogleShowApplications()} variant="outlined">
          {t(
            showAllApplications
              ? 'applications.hideAllApplications'
              : 'applications.showAllApplications'
          )}
        </Button>
      </Divider>

      {showAllApplications && (
        <Grid {...getTestId('application-grid')} container spacing={3} p={3}>
          {renderApplications(otherApplications || [])}
        </Grid>
      )}
    </Box>
  );
}
