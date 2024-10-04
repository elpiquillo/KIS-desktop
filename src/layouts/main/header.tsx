import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Iconify from "src/components/iconify";
import { useSidebarState } from 'src/store/sidebarState';

export default function Header() {
  const { sidebarOpen, setSidebarOpen } = useSidebarState();

  const handleToggleSidebar = () => {
    localStorage.setItem('sidebarOpen', JSON.stringify(!sidebarOpen));
    setSidebarOpen(!sidebarOpen);
  }

  return (
    <Box
      width="100%"
      sx={{
        userSelect: 'none',
        "WebkitAppRegion": "drag",
      }}
    >
      <IconButton
        sx={{
          ml: 10,
          "WebkitAppRegion": "no-drag"
        }}
        aria-label="collapse applications menu"
        onClick={handleToggleSidebar}
      >
        <Iconify
          icon={
            sidebarOpen
              ? "hugeicons:sidebar-left-01"
              : "hugeicons:sidebar-left"
          }
          color={(theme) => theme.palette.text.primary}
        />
      </IconButton>
    </Box>
  );
}