import { t } from "i18next";
import { useGetApplicationsAll } from "src/apis/application";
import ApplicationsList from "./apps-list";

export default function HomeView() {
  const { data, isLoading } = useGetApplicationsAll();

  return (
    <ApplicationsList
      title={`${t('global.welcomeUser', { name: 'Jo' })}`}
      applications={data}
      loading={isLoading}
    />
  );
}
