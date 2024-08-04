import { Card, CardHeader } from "@mui/material";
import { useParams } from "src/routes/hooks";
import { useDashboardAccessState } from "src/store/dashboardAccessState";

export default function ApplicationsView() {
  const { applicationId } = useParams();

  const application = useDashboardAccessState(
    (state) => state.applications.find((app) => app.id.id === applicationId)
  );

  return (
    <Card sx={{ height: '100%', borderRadius: 0 }}>
      <CardHeader />
    </Card>
  );
}