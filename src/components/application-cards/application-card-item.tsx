import { Avatar, Card, CardContent, CardHeader, IconButton, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import ApplicationInterface from "src/types/application-interface";

import Iconify from "../iconify";

interface ApplicationCardItemProps {
  application?: ApplicationInterface;
}


export default function ApplicationCardItem({ application }: ApplicationCardItemProps) {
  const theme = useTheme();

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
    <Card sx={{ height: "100%" }} key={application?.id.id}>
      <CardHeader
        title={appAvatar()}
        action={
          <>
            <IconButton
              aria-label={t('global.favorite')}
            >
              <Iconify icon="ic:round-star" width={24} color="warning.main" />
            </IconButton>
            <IconButton
              aria-label={t('global.options')}
            >
              <Iconify icon="ic:round-more-vert" width={24} color={theme.palette.text.secondary} />
            </IconButton>
          </>
        }
      />
      <CardContent>
        <Typography variant="subtitle2">
          {application?.name}
        </Typography>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          {application?.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
