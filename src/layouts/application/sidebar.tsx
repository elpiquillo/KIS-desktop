import { Box, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import SimpleBar from 'simplebar-react';
import { useGetDashboardMenu } from 'src/apis/dashboard-menu';
import NavItem from 'src/components/nav-section/mini/nav-item';
import { useActiveLink, useParams } from 'src/routes/hooks';
import { useDashboardAccessState } from 'src/store/dashboardAccessState';
import { useDashboardState } from 'src/store/dashboardState';
import '../../assets/fonts/style.css';
import { MenuItemData } from 'src/types/dashboard-menu-interface';
import { useCallback, useEffect, useRef, useState } from 'react';

function ApplicationMenuSidebar({
  onSidebarResize,
}: {
  onSidebarResize: (newWidth: number) => void;
}) {
  const { applicationId } = useParams();
  const application = useDashboardAccessState((state) =>
    state.applications.find((app) => app.id.id === applicationId)
  );
  const { isLoading } = useGetDashboardMenu({ dashboardId: applicationId });
  const { dashboardMenu } = useDashboardState();

  const ActiveLink = (url: string) => useActiveLink(url, true);

  const renderMenuItem = () =>
    !isLoading &&
    dashboardMenu?.content.map((item: MenuItemData) => {
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
    });

  const sidebarRef = useRef<HTMLInputElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(
    parseInt(localStorage.getItem('sideBarWidth') || '250', 10)
  );

  const startResizing = useCallback(() => {
    setIsResizing(true);
    document.body.style.cursor = sidebarWidth < 250 ? 'e-resize' : 'col-resize';
    document.body.style.userSelect = 'none';
  }, [sidebarWidth]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        if (sidebarRef.current) {
          setSidebarWidth(mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left);
          localStorage.setItem('sideBarWidth', sidebarWidth.toString());
          onSidebarResize(sidebarWidth);
        }
      }
    },
    [isResizing, sidebarWidth, onSidebarResize]
  );

  useEffect(() => {
    if (sidebarWidth <= 250) {
      setSidebarWidth(230);
    }
    if (sidebarWidth <= 150) {
      setSidebarWidth(10);
    }
  }, [sidebarWidth]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <>
      <Grid
        item
        ref={sidebarRef}
        sx={{
          width: sidebarWidth,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <SimpleBar style={{ maxHeight: 'calc(100vh - 64px)', overflowX: 'hidden', flex: 1 }}>
          <CardHeader title={application?.name} />
          <CardContent>{renderMenuItem()}</CardContent>
        </SimpleBar>
      </Grid>
      <Box
        sx={{
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: '6px',
          justifySelf: 'flex-end',
          cursor: sidebarWidth < 230 ? 'e-resize' : 'col-resize',
          resize: 'horizontal',
          ':hover': {
            width: '3px',
            background: '#c1c3c5b4',
          },
        }}
        onMouseDown={startResizing}
      />
    </>
  );
}

export default ApplicationMenuSidebar;
