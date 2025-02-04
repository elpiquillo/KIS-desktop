import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  IconButton,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { usePutDashboardAccess } from 'src/apis/dashboard-access';
import DashboardAccessInterface from 'src/types/dashboard-access-interface';
import { getTestId } from 'src/utils/data-test-id.helper';

import CustomPopover, { usePopover } from '../custom-popover';
import Iconify from '../iconify';


interface ApplicationCardItemProps {
  application?: DashboardAccessInterface;
}

export default function ApplicationCardItem({ application }: ApplicationCardItemProps) {
  const theme = useTheme();
  const popover = usePopover();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { putDashboardAccess } = usePutDashboardAccess();

  const onSubmitFavorite = async (currentApplication: DashboardAccessInterface | undefined) => {
    if (!currentApplication) return;

    try {
      await putDashboardAccess({
        id: currentApplication.id,
        favorite: !currentApplication.id.favorite,
      } as DashboardAccessInterface);
      enqueueSnackbar(
        !currentApplication.favorite
          ? t('applications.favoriteSuccess')
          : t('applications.removeFromFavoritesSuccess'),
        {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'center' },
        }
      );
    } catch (error: any) {
      enqueueSnackbar(t('favoriteError'), {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  };

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
      <Avatar sx={{ height: 48, width: 48 }}>
        <Typography variant="subtitle2" color="grey.600">
          {application?.name.charAt(0)}
        </Typography>
      </Avatar>
    );
  }

  return (
    <Card
      {...getTestId('application-card-item-container')}
      key={application?.id.id}
      sx={{ boxShadow: 0, border: 1, borderColor: theme.palette.divider }}
    >
      <CardActionArea onClick={() => navigate(`/${application?.id.id}`)}>
        <CardHeader
          title={appAvatar()}
          action={
            <>
              <IconButton
                aria-label={t('global.favorite')}
                onClick={(e) => {
                  e.stopPropagation();
                  onSubmitFavorite(application);
                }}
              >
                <Iconify
                  icon={application?.favorite ? 'ic:round-star' : 'ic:round-star-outline'}
                  width={24}
                  color={application?.favorite ? 'warning.main' : 'gray'}
                />
              </IconButton>

              <IconButton
                aria-label={t('global.options')}
                onClick={(e) => {
                  e.stopPropagation();
                  popover.onOpen(e);
                }}
              >
                <Iconify
                  icon="ic:round-more-vert"
                  width={24}
                  color={theme.palette.text.secondary}
                />
              </IconButton>

              <CustomPopover
                open={popover.open}
                onClose={popover.onClose}
                sx={{ width: 200 }}
                onClick={popover.onClose}
              >
                <MenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmitFavorite(application);
                    popover.onClose();
                  }}
                >
                  <Iconify
                    icon={application?.favorite ? 'ic:round-star' : 'ic:round-star-outline'}
                    color={application?.favorite ? 'warning.main' : 'gray'}
                  />
                  {application?.favorite
                    ? t('global.removeFromFavorites')
                    : t('global.addToFavorites')}
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
