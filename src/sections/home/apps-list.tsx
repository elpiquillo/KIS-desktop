import { Card, CardHeader, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { ApplicationCards, ApplicationCardSkeleton } from 'src/components/application-cards';
import DashboardAccessInterface from 'src/types/dashboard-access-interface';

import SimpleBar from 'simplebar-react';
import { applyFilter, removeAccents } from 'src/utils/applyFilter';

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

  return (
    <Card sx={{ height: '100%', borderRadius: 0 }}>
      <CardHeader
        title={
          <Stack direction="row" alignItems="center">
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>
              {title.split('').map((letter) => (
                <motion.span key={`${letter}`} variants={letterVariants}>
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </Stack>
        }
        action={headerActions}
      />
      <SimpleBar style={{ maxHeight: 'calc(100vh - 100px)' }}>
        {loading && <ApplicationCardSkeleton numberOfCards={5} />}
        <ApplicationCards applications={applicationFiltered} />
      </SimpleBar>
    </Card>
  );
}
