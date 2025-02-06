import { IconButton, useTheme } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCollapseDashboardMenu } from 'src/store/collapseDashboardMenu';

export default function CollapseMenuButton() {
  const { setCollapseAppMenu, collapseAppMenu } = useCollapseDashboardMenu();
  const lgUp = useResponsive('up', 'lg');
  const theme = useTheme();

  return (
    <IconButton
      size="small"
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        ml: lgUp ? 1 : 0,
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
  );
}
