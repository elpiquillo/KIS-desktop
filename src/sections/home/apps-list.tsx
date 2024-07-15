import { Card, CardContent, CardHeader, Grid, InputAdornment, TextField } from "@mui/material";
import { t } from "i18next";
import Iconify from "src/components/iconify";
import { motion } from "framer-motion";
import ApplicationInterface from "src/types/application-interface";
import { ApplicationCards, ApplicationCardSkeleton } from "src/components/application-cards";
import SimpleBar from "simplebar-react";

interface ApplicationsListProps {
  title: string;
  loading: boolean;
  applications: ApplicationInterface[];
}

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
  }
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03
    }
  }
};

export default function ApplicationsList({
  title,
  loading,
  applications
}: ApplicationsListProps) {

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {title.split('').map((letter) => (
              <motion.span key={`${letter}`} variants={letterVariants}>
                {letter}
              </motion.span>
            ))}
          </motion.div>
        }
        action={
          <TextField
            size="small"
            label={(
              t('global.searchByName')
            )}
            sx={{ mr: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="ic:baseline-search" color="grey.300" />
                </InputAdornment>
              ),
            }}
          />
        }
      />
      {/* <CardContent> */}
        <SimpleBar style={{ maxHeight: 'calc(100vh - 150px)' }}>
          { loading && (
            <ApplicationCardSkeleton numberOfCards={5} />
          )}
          <ApplicationCards applications={applications} />
        </SimpleBar>
      {/* </CardContent> */}
    </Card>
  );
}