import { alpha, Card, Tooltip, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { useGetDashboardMenu } from 'src/apis/dashboard-menu';
import AppNameChip from 'src/components/app-name-chip/app-name-chip';
import { useDeleteNotification } from 'src/apis/notifications';
import NavItem from 'src/components/nav-section/mini/nav-item';

import { useResponsive } from 'src/hooks/use-responsive';

import { useActiveLink, useParams } from 'src/routes/hooks';
import { useCollapseDashboardMenu } from 'src/store/collapseDashboardMenu';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { useDashboardState } from 'src/store/dashboardState';
import { useNotificationState } from 'src/store/notificationState';
import useThemeStore from 'src/store/themeModeState';
import { MenuItemData } from 'src/types/dashboard-menu-interface';
import themesColor from 'src/utils/themes-color';
import CollapseMenuButton from './collapseMenuButton';
import '../../assets/fonts/style.css';

function ApplicationMenuSidebar() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const { applicationId, pageId } = useParams();
  const navigate = useNavigate();
  const lgUp = useResponsive('up', 'lg');
  const { themeName } = useThemeStore();
  const { collapseAppMenu, setCollapseAppMenu } = useCollapseDashboardMenu();

  const application = useDashboardAccessState((state) =>
    state.applications.find((app) => app.id.id === applicationId)
  );
  const { setCollapseAppMenu, collapseAppMenu } = useCollapseDashboardMenu();
  const dashboardMenu = useDashboardState((state) => state.dashboardMenu);
  const notifications = useNotificationState((state) => state.notifications);

  const { isLoading } = useGetDashboardMenu({ dashboardId: applicationId });
  const { deleteNotification } = useDeleteNotification();

  const ActiveLink = (url: string) => useActiveLink(url, true);

  const handleCloseSnackbar = (id: string) => () => {
    deleteNotification({ id });
  };

  useEffect(() => {
    if (!pageId && !isLoading && dashboardMenu?.content && dashboardMenu.content.length > 0) {
      const page = dashboardMenu?.content.find((content) => content.is_title === false);
      navigate(`/${applicationId}/${page?.menu_item_url.url}`);
    }
  }, [applicationId, dashboardMenu?.content, isLoading, navigate, pageId]);

  useEffect(() => {
    const notificationsForApp = notifications?.filter(
      (notification) => notification.app_id.$oid === applicationId
    );
    if (notificationsForApp?.length) {
      notificationsForApp.forEach((notification) => {
        enqueueSnackbar(notification.message, {
          variant: 'extended',
          title: notification.title,
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
          autoHideDuration: null,
          onClose: handleCloseSnackbar(notification._id.$oid),
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, enqueueSnackbar]);

  const renderMenuItem = () =>
    !isLoading &&
    dashboardMenu?.content.map((item: MenuItemData) => {
      const { visible } = item;
      const menuItemUrl = item.menu_item_url;

      const iconName = menuItemUrl?.icon_name.replace('kis-', '');

      if (item.is_title) {
        if (collapseAppMenu) {
          return (
            <Tooltip title={menuItemUrl.text} placement="right">
              <Typography
                key={menuItemUrl.text}
                variant="subtitle2"
                ml={1.5}
                my={1.5}
                color="text.secondary"
              >
                --
              </Typography>
            </Tooltip>
          );
        }

        return (
          <Typography key={menuItemUrl.text} variant="subtitle2" ml={1} my={1.5}>
            {menuItemUrl.text}
          </Typography>
        );
      }

      if (!item.is_title && visible) {
        if (collapseAppMenu) {
          return (
            <Tooltip title={menuItemUrl.text} placement="right">
              <NavItem
                key={menuItemUrl.text}
                title=""
                path={`${applicationId}/${menuItemUrl.url}`}
                icon={
                  <i className={`icon-${iconName}`} style={{ fontSize: 20, padding: 0 }}>
                    <span className="path1" />
                    <span className="path2" />
                  </i>
                }
                active={ActiveLink(`${applicationId}/${menuItemUrl.url}`)}
                sx={{
                  '&:hover, &:focus, &:active': {
                    background: themesColor[themeName as keyof typeof themesColor].item_background,
                  },
                }}
              />
            </Tooltip>
          );
        }

        return (
          <NavItem
            onClick={() => !lgUp && setCollapseAppMenu(true)}
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
            sx={{
              background: ActiveLink(`${applicationId}/${menuItemUrl.url}`)
                ? alpha(themesColor[themeName as keyof typeof themesColor].item_background, 0.5)
                : 'none',
              '&:hover': {
                background: alpha(
                  themesColor[themeName as keyof typeof themesColor].item_background,
                  0.3
                ),
              },
            }}
          />
        );
      }

      return null;
    });

  return (
    <Grid
      item
      sx={{
        background: alpha(theme.palette.background.paper, 0.6),
        width: collapseAppMenu ? 80 : 300,
        transition: 'width 0.3s ease-in-out',
        ...(lgUp
          ? {}
          : {
              transition: 'none',
              width: collapseAppMenu ? 0 : '100%',
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              zIndex: 9999, // Ensure it's above other elements
              backdropFilter: 'blur(10px)', // Optional to match existing design
            }),
      }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'none',
          border: 'none',
          pr: 2,
          ...(!lgUp && { pr: 0, borderRadius: 0 }),
        }}
      >
        <SimpleBar style={{ maxHeight: 'calc(100vh - 64px)', overflowX: 'hidden', flex: 1 }}>
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 1,
              backdropFilter: 'blur(10px)',
              borderBottom: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <CardHeader
              sx={{ px: 1, py: 1.6 }}
              title={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {!collapseAppMenu && (
                    <AppNameChip
                      application_name={application?.name || ''}
                      application_logo={application?.logo || ''}
                    />
                  )}
                  <CollapseMenuButton />
                </Box>
              }
            />
          </Box>

          <CardContent sx={{ px: 1.5 }}>{renderMenuItem()}</CardContent>
        </SimpleBar>
      </Card>
    </Grid>
  );
}

export default ApplicationMenuSidebar;
