import { Card, CardHeader, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { ApplicationCards, ApplicationCardSkeleton } from 'src/components/application-cards';
import DashboardAccessInterface from 'src/types/dashboard-access-interface';

import SimpleBar from 'simplebar-react';
import { applyFilter, removeAccents } from 'src/utils/applyFilter';
import { Children } from 'react';
import { sortApplicationsByFavorite } from 'src/utils/sortApplications';
import { getTestId } from 'src/utils/data-test-id.helper';

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

  return (
    <Card {...getTestId('applications-list-container')} sx={{ height: '100%', borderRadius: 0 }}>
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
        action={headerActions}
      />
      <SimpleBar style={{ maxHeight: 'calc(100vh - 100px)' }}>
        {loading && <ApplicationCardSkeleton numberOfCards={5} />}
        <ApplicationCards applications={sortedApplications} />
      </SimpleBar>
    </Card>
  );
}
