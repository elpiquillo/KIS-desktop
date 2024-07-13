import { Box, Button, Typography } from "@mui/material";

interface SectionHeaderProps {
  title?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ title, action}: SectionHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="subtitle1">
        {title}
      </Typography>

      {action && action}
    </Box>
  )
};