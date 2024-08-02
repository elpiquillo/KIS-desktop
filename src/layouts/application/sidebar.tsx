import { Card, CardContent, CardHeader, Grid, Menu } from "@mui/material";
import { t } from "i18next";
import SvgColor from "src/components/svg-color";
import { useActiveLink, useParams } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { useApplicationState } from "src/store/applicationState";

function ActiveLink(path: string, exact: boolean) {
  return useActiveLink(path, exact);
}

export default function ApplicationMenuSidebar() {
  const { applicationId } = useParams();
  const application = useApplicationState((state) => state.applications.find((app) => app.id.id === applicationId));

  const items = [
  ];

  return (
    <Grid item xs={3} xl={2}>
      <CardHeader title={application?.name} />
      <CardContent>
        {/* Menu here */}
      </CardContent>
    </Grid>
  )
}
