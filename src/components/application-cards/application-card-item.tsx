import { Avatar, Card, CardActionArea, CardContent, CardHeader, IconButton, MenuItem, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import DashboardAccessInterface from "src/types/dashboard-access-interface";

import Iconify from "../iconify";
import CustomPopover, { usePopover } from "../custom-popover";

interface ApplicationCardItemProps {
  application?: DashboardAccessInterface;
}


export default function ApplicationCardItem({ application }: ApplicationCardItemProps) {
  const theme = useTheme();
  const popover = usePopover();
  const navigate = useNavigate();

  function appAvatar() {
    if (application?.logo) {
      return (
        <Avatar
          sx={{
            height: 48,
            width: 48,
          }}
          src={application?.logo}
          alt={application?.name}
        />
      );
    }

    return (
      <Avatar
        sx={{ height: 48, width: 48 }}
      >
        <Typography variant="subtitle2" color="grey.600">
          {application?.name.charAt(0)}
        </Typography>
      </Avatar>
    );
  }

  return (
    <Card
      key={application?.id.id}
      sx={{ boxShadow: 0, border: 1, borderColor: theme.palette.divider }}>
      <CardActionArea onClick={() => navigate(`/${application?.id.id}`)}>
        <CardHeader
          title={appAvatar()}
          action={
            <>
              <IconButton aria-label={t('global.favorite')} >
                <Iconify icon="ic:round-star" width={24} color="warning.main" />
              </IconButton>
              
              <IconButton aria-label={t('global.options')}
                onClick={(e) => {
                  e.stopPropagation();
                  popover.onOpen(e);
                }}
              >
                <Iconify icon="ic:round-more-vert" width={24} color={theme.palette.text.secondary} />
              </IconButton>

              <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                sx={{ width: 160 }}
                onClick={popover.onClose}
              >
                <MenuItem>
                  <Iconify icon="mdi:star-outline" />
                  {t('global.addToFavorites')}
                </MenuItem>
                <MenuItem>
                  <Iconify icon="mdi:trash-can-outline" color={theme.palette.error.main} />
                  <Typography color={theme.palette.error.main} variant="body2">
                    {t('global.disconnect')}
                  </Typography>
                </MenuItem>
              </CustomPopover>
            </>
          }
        />
        <CardContent>
          <Typography variant="subtitle2">{application?.name}</Typography>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {application?.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
