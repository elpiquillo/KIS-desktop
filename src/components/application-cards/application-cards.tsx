import { Grid } from "@mui/material";
import DashboardAccessInterface from "src/types/dashboard-access-interface";

import ApplicationCardItem from "./application-card-item";

interface ApplicationsCardProps {
  applications?: DashboardAccessInterface[];
}

export default function ApplicationCards({ applications }: ApplicationsCardProps) {
  return (
    <Grid container spacing={3} p={3}>
      {applications?.filter((app) => app.id.display === true).map((application: any) => (
        <Grid item key={application.id.id} xs={12} sm={6} md={4} lg={3}>
          <ApplicationCardItem application={application} />
        </Grid>
      ))}
    </Grid>
  );
}
