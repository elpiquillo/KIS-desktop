import { Grid } from "@mui/material";
import ApplicationMenuSidebar from "./sidebar";

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  return (
    <Grid container columnSpacing={{ xs: 1 }} height="100%">
      <ApplicationMenuSidebar />
      <Grid item xs={9.5} xl={10}>
        {children}
      </Grid>
    </Grid>
  );
}
