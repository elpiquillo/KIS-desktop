import { t } from "i18next";
import { useGetDashboardAccessesAll } from "src/apis/dashboard-access";

import ApplicationsList from "./apps-list";

export default function HomeView() {
  const { data, isLoading } = useGetDashboardAccessesAll();

  return (
    <ApplicationsList
      title={`${t('global.welcomeUser', { name: 'Jo' })}`}
      applications={data}
      loading={isLoading}
    />
  );
}
