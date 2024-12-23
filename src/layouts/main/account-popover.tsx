import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useLogin } from 'src/auth/useLogin';
import Upercase from 'src/utils/upercase';
import { useUserState } from 'src/store/userState';
import { IconButton, useTheme } from '@mui/material';
import { action } from 'src/theme/palette';
import { t } from 'i18next';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { AccountSettingsModal } from './account-settings-modal';

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const theme = useTheme();

  const router = useRouter();
  const accountSettings = useBoolean();

  const user = useUserState((s) => s.userInfos);
  const { logout } = useLogin();

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      await logout();
      popover.onClose();
      router.replace('/login');
    } catch (error) {
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const openSettingsModal = () => {
    accountSettings.onTrue();
    popover.onClose();
  };

  return (
    <>
      <IconButton
        aria-label="account settings"
        component={Avatar}
        onClick={popover.onOpen}
        sx={{
          borderRadius: 2,
          width: 48,
          height: 48,
          marginLeft: 'auto',
          marginRight: 'auto',
          backgroundColor: theme.palette.primary.darker,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&:active': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Avatar
          sx={{
            backgroundColor: 'transparent',
          }}
          variant="square"
        >
          <Typography variant="subtitle2" sx={{ color: theme.palette.action.active }}>
            {user &&
              Upercase(String(`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`))}
          </Typography>
        </Avatar>
      </IconButton>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        hiddenArrow
        sx={{ width: 200, p: 0 }}
      >
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.first_name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={openSettingsModal}>
            <Iconify icon="iconamoon:profile-circle-light" width={20} />
            {t('settings.profileSettings')}
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
            sx={{ fontWeight: 'fontWeightBold', color: 'error.main' }}
          >
            <Iconify icon="eva:log-out-outline" color="error" width={20} />
            {t('logout')}
          </MenuItem>
        </Stack>
      </CustomPopover>

      <AccountSettingsModal open={accountSettings.value} onClose={accountSettings.onFalse} />
    </>
  );
}
