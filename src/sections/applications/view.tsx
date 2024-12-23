import { Card, CardHeader } from '@mui/material';
import { useGetDashboardPage } from 'src/apis/dashboard-page';
import { useParams } from 'src/routes/hooks';
import PageView from './page-view';

export default function ApplicationsView() {
  const { applicationId, pageId } = useParams();
  const { isLoading: isLoadingPage } = useGetDashboardPage({
    dashboardId: applicationId || '?',
    pageId: pageId || '?',
  });

  return <PageView />;
}
