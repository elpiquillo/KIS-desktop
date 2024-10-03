import { Box, Button, IconButton, Stack } from "@mui/material";
import Iconify from "src/components/iconify";

export default function Header() {
  return (
    <Box
      width="100%"
      sx={{
        userSelect: 'none',
        "WebkitAppRegion": "drag"
      }}
    >
      <IconButton
        sx={{
          ml: 10,
          "WebkitAppRegion": "no-drag"
        }}
        aria-label="collapse applications menu"
      >
        <Iconify icon="hugeicons:sidebar-left" color={(theme) => theme.palette.text.primary} />
      </IconButton>
    </Box>
  );
}