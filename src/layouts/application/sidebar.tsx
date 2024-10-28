import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import SimpleBar from 'simplebar-react';
import { useGetDashboardMenu } from 'src/apis/dashboard-menu';
import NavItem from 'src/components/nav-section/mini/nav-item';
import { useActiveLink, useParams } from 'src/routes/hooks';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { useDashboardState } from 'src/store/dashboardState';
import '../../assets/fonts/style.css';
import { MenuItemData } from 'src/types/dashboard-menu-interface';
import { alpha, Avatar, Card, Chip, Divider, IconButton, Tooltip, useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useCollapseDashboardMenu } from 'src/store/collapseDashboardMenu';

function ApplicationMenuSidebar() {
  const { applicationId } = useParams();
  const theme = useTheme();
  const application = useDashboardAccessState((state) =>
    state.applications.find((app) => app.id.id === applicationId)
  );
  const { isLoading } = useGetDashboardMenu({ dashboardId: applicationId });
  const { dashboardMenu } = useDashboardState();

  const { setCollapseAppMenu, collapseAppMenu } = useCollapseDashboardMenu();

  const ActiveLink = (url: string) => useActiveLink(url, true);

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
          <Typography variant="subtitle2" ml={1} my={1.5}>
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
              />
            </Tooltip>
          );
        }

        return (
          <NavItem
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
    });

  return (
    <Grid
      item
      sx={{
        background: alpha(theme.palette.background.paper, 0.6),
        width: collapseAppMenu ? 80 : 300,
        transition: 'width 0.3s ease-in-out',
      }}
    >
      <Card sx={{ height: '100%', background: 'none', border: 'none', pr: 2 }}>
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
                    <Chip
                      color="default"
                      variant="outlined"
                      sx={{
                        maxWidth: 'calc(100% - 40px)',
                      }}
                      avatar={
                        <Avatar
                          variant="square"
                          alt={application?.name}
                          src={application?.logo}
                          sx={{ background: theme.palette.background.paper }}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            maxWidth: '130px', // Set a maximum width for the text
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                          }}
                        >
                          {application?.name}
                        </Typography>
                      }
                    />
                  )}
                  <IconButton
                    size="small"
                    sx={{
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                      ml: 1,
                    }}
                    aria-label="collapse applications menu"
                    onClick={() => {
                      setCollapseAppMenu(!collapseAppMenu);
                    }}
                  >
                    <Iconify
                      icon={collapseAppMenu ? 'mdi:chevron-right' : 'mdi:chevron-left'}
                      color={theme.palette.text.primary}
                    />
                  </IconButton>
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
