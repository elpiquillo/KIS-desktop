import { Grid } from "@mui/material";
import SettingsSidebar from "./sidebar";

type Props = {
  children: React.ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  return (
    <Grid container columnSpacing={{ xs: 1 }} height="100%">
      <SettingsSidebar />
      <Grid item xs={9} xl={10}>
        {children}
      </Grid>
    </Grid>
  );
}
