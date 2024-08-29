import { Avatar, Box, IconButton, Skeleton, Stack, Tooltip, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useActiveLink } from "src/routes/hooks";
import DashboardAccessInterface from "src/types/dashboard-access-interface";

interface NavAppSectionProps {
  applications: DashboardAccessInterface[];
}

export default function NavAppSection({
  applications
}: NavAppSectionProps) {

  const navigate = useNavigate();
  const theme = useTheme();

  function ActiveLink(path: string, exact: boolean) {
    return useActiveLink(path, exact);
  }

  if (!applications.length) {
    return (
      <Stack m="auto">
        <Skeleton variant="circular" width={48} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="circular" width={48} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="circular" width={48} height={48} sx={{ mb: 1 }} />
      </Stack>
    );
  }

  return applications.filter((app) => app.id.display).map((app) => (
    <Stack key={app.id.id} m="auto" mb={1.5}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {ActiveLink(app.id.id, false) && (
          <Box
            sx={{
              width: 4,
              height: 32,
              backgroundColor: theme.palette.success.main,
              position: 'absolute',
              left: -9,
              borderRadius: '0px 6px 6px 0px'
            }}
          />
        )}
        <Tooltip
          title={app.name}
          placement="right"
          disableInteractive
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, -8],
                  },
                },
              ],
            },
          }}
        >
          <IconButton
            key={app.id.id}
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.background.neutral,
              borderRadius: ActiveLink(app.id.id, false) ? 1 : 30,
            }}
            aria-label={app.name}
            onClick={() => navigate(app.id.id)}
          >
            <Avatar
              alt={app.name}
              src={app.logo}
              sx={{ height: 48, width: 48 }}
              variant={ActiveLink(app.id.id, false) ? 'rounded' : 'circular'}
            />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  ));
}
