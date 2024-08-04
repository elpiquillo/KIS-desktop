import { CardContent, CardHeader, Grid, Typography } from "@mui/material";
import SimpleBar from "simplebar-react";
import { useGetDashboardMenu } from "src/apis/dashboard-menu";
import NavItem from "src/components/nav-section/mini/nav-item";
import { useActiveLink, useParams } from "src/routes/hooks";
import { useDashboardAccessState } from "src/store/dashboardAccessState";
import { useDashboardState } from "src/store/dashboardState";
import '../../assets/fonts/style.css';
import { MenuItemData } from "src/types/dashboard-menu-interface";

function ApplicationMenuSidebar() {
  const { applicationId } = useParams();
  const application = useDashboardAccessState(
    (state) => state.applications.find((app) => app.id.id === applicationId)
  );
  const { isLoading } = useGetDashboardMenu({ dashboardId: applicationId });
  const { dashboardMenu } = useDashboardState();

  const ActiveLink = (url: string) => (
    useActiveLink(url, true)
  );

  const renderMenuItem = () => (
    !isLoading && dashboardMenu?.content.map((item: MenuItemData) => {
      const { visible } = item;
      const menuItemUrl = item.menu_item_url;

      const iconName = menuItemUrl?.icon_name.replace('kis-', '');

      if (item.is_title) {
        return (
          <Typography key={menuItemUrl.text} variant="subtitle2" ml={1} my={1.5}>
            {menuItemUrl.text}
          </Typography>
        );
      }

      if (visible) {
        return (
          <NavItem
            key={menuItemUrl.text}
            title={menuItemUrl.text}
            path={`${applicationId}/${menuItemUrl.url}`}
            icon={
              <i className={`icon-${iconName}`} style={{ fontSize: 20, padding: 0 }}>
                <span className="path1" />
                <span className="path2" />
              </i>
            }
            active={ActiveLink(`${applicationId}/${menuItemUrl.url}`)}
          />
        );
      }

      return null;
    })
  );

  return (
    <Grid item xs={2.5} xl={2}>
      <SimpleBar style={{ maxHeight: 'calc(100vh - 64px)', overflowX: 'hidden' }}>
        <CardHeader title={application?.name} />
        <CardContent>
          {renderMenuItem()}
        </CardContent>
      </SimpleBar>
    </Grid>
  );
}

export default ApplicationMenuSidebar;
