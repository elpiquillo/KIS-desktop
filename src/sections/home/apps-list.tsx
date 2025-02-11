import { Box, Card, CardHeader, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { Children } from 'react';
import SimpleBar from 'simplebar-react';
import { ApplicationCards, ApplicationCardSkeleton } from 'src/components/application-cards';
import { useResponsive } from 'src/hooks/use-responsive';
import DashboardAccessInterface from 'src/types/dashboard-access-interface';

import { applyFilter, removeAccents } from 'src/utils/applyFilter';
import { getTestId } from 'src/utils/data-test-id.helper';
import { sortApplicationsByFavorite } from 'src/utils/sortApplications';

interface ApplicationsListProps {
  title: string;
  loading: boolean;
  applications: DashboardAccessInterface[];
  searchValue: string;
  headerActions: React.ReactNode;
}

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export default function ApplicationsList({
  title,
  loading,
  applications,
  searchValue,
  headerActions,
}: ApplicationsListProps) {
  const applicationFiltered = applyFilter<DashboardAccessInterface>({
    inputData: applications,
    comparator: (a, b) => a.name.localeCompare(b.name),
    searchValue,
    filterFunction: (item, valueSearched) =>
      removeAccents(item.name).toLowerCase().includes(valueSearched),
  });

  const sortedApplications = sortApplicationsByFavorite(applicationFiltered);
  const lgUp = useResponsive('up', 'lg');
  const smDown = useResponsive('down', 'sm');

  return (
    <Card {...getTestId('applications-list-container')} sx={{ height: '100%' }}>
      <CardHeader
        {...getTestId('applications-list-header')}
        title={
          <Stack direction="row" alignItems="center">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              {Children.toArray(
                title
                  .split('')
                  .map((letter) => <motion.span variants={letterVariants}>{letter}</motion.span>)
              )}
            </motion.div>
          </Stack>
        }
        action={lgUp && headerActions}
      />
      {!lgUp && <Box sx={{ px: 3, pb: 2, pt: 1 }}>{headerActions}</Box>}
      <SimpleBar
        style={{
          ...(lgUp && { maxHeight: 'calc(100vh - 100px)' }),
          ...(smDown && { maxHeight: 'calc(100vh - 210px)' }),
        }}
      >
        {loading && <ApplicationCardSkeleton numberOfCards={5} />}
        <ApplicationCards applications={sortedApplications} />
      </SimpleBar>
    </Card>
  );
}
