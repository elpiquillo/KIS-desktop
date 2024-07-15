import { Card, CardHeader } from "@mui/material";
import { useParams } from "src/routes/hooks";
import { useApplicationState } from "src/store/applicationState";

export default function ApplicationsView() {
  const { applicationId } = useParams();

  const application = useApplicationState((state) => state.applications.find((app) => app.id.id === applicationId));

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader />
    </Card>
  );
}