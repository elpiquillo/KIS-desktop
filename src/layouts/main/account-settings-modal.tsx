import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import i18next, { t } from 'i18next';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { usePutPassword, usePutUserInfos, useUppyToUpdateProfilePicture } from 'src/apis/account';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { languages } from 'src/locales/config-lang';
import { changeLanguage } from 'src/locales/i18n';
import useThemeStore from 'src/store/themeModeState';
import { useUserState } from 'src/store/userState';
import { useThemeMode } from 'src/theme/ThemeModeContext';
import { apiFetcher } from 'src/utils/fetchers';
import themesColor from 'src/utils/themes-color';
import { urls } from 'src/utils/urls';

interface ModalProps {
  open: boolean;
  onClose: () => void; // Add the onClose property
}

type Meta = { license: string };

// ----------------------------------------------------------------------

export function AccountSettingsModal({ open, onClose }: ModalProps) {
  const theme = useTheme();
  const { putUserInfos } = usePutUserInfos();
  const { putPassword } = usePutPassword();
  const { paletteMode, togglePaletteMode } = useThemeMode();
  const { enqueueSnackbar } = useSnackbar();
  const uppy = useUppyToUpdateProfilePicture();
  const { setThemeName } = useThemeStore();
  const { setUserInfos } = useUserState();

  const password = useBoolean();
  const passwordConfirmation = useBoolean();
  const [pictureUrlState, setPictureUrlState] = useState('');
  const [fileState, setFileState] = useState<File>();
  const [fileUploading, setFileUploading] = useState(false);
  const [appInfo, setAppInfo] = useState({
    name: '',
    description: '',
    logo: '' as any,
  });
  const user = useUserState((s) => s.userInfos);
  const userAvatar = user && `${user?.first_name?.[0]}${user?.last_name?.[0]}`;

  const AccountInfos = Yup.object().shape({
    firstName: Yup.string().default(user?.first_name),
    lastName: Yup.string().default(user?.last_name),
    email: Yup.string()
      .default(user?.email)
      .email(t('applications.applicationsPage.emailInvalid'))
      .required(t('applications.applicationsPage.required')),
  });

  const AccountPassword = Yup.object().shape({
    password: Yup.string()
      .typeError(t('auth.passwordInvalid'))
      .min(7, t('auth.passwordMin'))
      .required(t('auth.passwordRequired')),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password')], t('auth.passwordMatch'))
      .required(t('auth.passwordConfirmation')),
  });

  const acountPasswordMethods = useForm({
    resolver: yupResolver(AccountPassword),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
  });

  const accountInfosMethods = useForm({
    resolver: yupResolver(AccountInfos),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = accountInfosMethods;

  const onSubmitAccountInfos = handleSubmit(async (formData: any) => {
    if (!user) return;
    try {
      await putUserInfos({
        first_name: formData.firstName,
        last_name: formData.lastName,
        id: user.id,
        avatar_data: {
          id: appInfo.logo.id,
          storage: 'cache',
          metadata: {
            filename: fileState?.name || '',
            mime_type: fileState?.type || 'image/jpeg',
            size: fileState?.size || 0,
          },
          url: pictureUrlState,
        },
      });
      enqueueSnackbar(t('settings.userInfosUpdated'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });

      onClose();
    } catch (error) {
      // Add your error handling logic here
    }
  });

  const onSubmitPasswordUpdate = acountPasswordMethods.handleSubmit(async (formData: any) => {
    try {
      await putPassword({
        password: formData.password,
        password_confirmation: formData.passwordConfirmation,
      });

      enqueueSnackbar(t('settings.userInfosUpdated'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });

      onClose();
    } catch (error) {
      // Add your error handling logic here
    }
  });

  const infosForm = (
    <FormProvider methods={accountInfosMethods} onSubmit={onSubmitAccountInfos}>
      <Grid container spacing={2} marginBottom={1}>
        <Grid item xs={6}>
          <RHFTextField
            defaultValue={user?.first_name}
            name="firstName"
            label={t('settings.firstName')}
            placeholder={t('settings.firstName')}
            autoFocus
            margin="dense"
            variant="outlined"
            type="text"
          />
        </Grid>
        <Grid item xs={6}>
          <RHFTextField
            defaultValue={user?.last_name}
            name="lastName"
            label={t('settings.lastName')}
            placeholder={t('settings.lastName')}
            margin="dense"
            variant="outlined"
            type="text"
          />
        </Grid>
      </Grid>
      <RHFTextField
        disabled
        defaultValue={user?.email}
        name="email"
        label={t('settings.emailAddress')}
        placeholder={t('settings.emailAddress')}
        margin="dense"
        variant="outlined"
        type="text"
      />
    </FormProvider>
  );

  const passwordForm = (
    <FormProvider methods={acountPasswordMethods} onSubmit={onSubmitPasswordUpdate}>
      <RHFTextField
        sx={{ mt: 2 }}
        name="password"
        label={t('settings.password')}
        placeholder="********"
        margin="dense"
        variant="outlined"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  color="grey.400"
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <RHFTextField
        sx={{ mt: 2 }}
        name="passwordConfirmation"
        label={t('settings.passwordConfirmation')}
        placeholder="********"
        margin="dense"
        variant="outlined"
        type={passwordConfirmation.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={passwordConfirmation.onToggle} edge="end">
                <Iconify
                  icon={passwordConfirmation.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                  color="grey.400"
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        size="small"
        color="success"
        startIcon={<Iconify icon="material-symbols:lock-reset" />}
        sx={{ mb: 1 }}
        type="submit"
      >
        {t('settings.changePassword')}
      </Button>
    </FormProvider>
  );

  const languageField = (
    <FormProvider methods={accountInfosMethods}>
      <RHFSelect
        name="language"
        label={t('settings.language')}
        margin="dense"
        variant="outlined"
        defaultValue={i18next.language || 'en'}
        onChange={(e) => {
          changeLanguage(e.target.value);
        }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Iconify icon={lang.icon} sx={{ borderRadius: 0.65, width: 28, mr: 1 }} />

            {t(`settings.languages.${lang.name}`)}
          </MenuItem>
        ))}
      </RHFSelect>
    </FormProvider>
  );

  const setNewTheme = (themeParam: string) => () => {
    setThemeName(themeParam);

    const isDarkTheme = themeParam.includes('Dark');
    const isLightMode = paletteMode === 'light';
    const isDarkMode = paletteMode === 'dark';

    if (isDarkTheme && isLightMode) {
      togglePaletteMode();
    } else if (!isDarkTheme && isDarkMode) {
      togglePaletteMode();
    }

    document.body.style.background =
      themesColor[themeParam as keyof typeof themesColor].app_background;

    onClose();
    enqueueSnackbar(t('global.goodChoice'), {
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
    });
  };

  const getFilteredThemes = (color: 'light' | 'dark') =>
    Object.entries(themesColor)
      .filter(([key, _]) => (color === 'dark' ? key.includes('Dark') : !key.includes('Dark')))
      .reduce(
        (acc, [key, value]) => {
          acc[key as keyof typeof themesColor] = value;
          return acc;
        },
        {} as { [key: string]: { app_background: string; item_background: string } }
      );

  const themesSelection = (themeType: 'light' | 'dark') =>
    Object.entries(getFilteredThemes(themeType)).map(([key, value]) => (
      <Grid
        key={key}
        item
        xs={5}
        sx={{ background: value.app_background }}
        component={Button}
        height={40}
        m={0.7}
        aria-label={key}
        onClick={setNewTheme(key)}
      />
    ));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUploading(true);
      setFileState(file);
      uppy.addFile(file);
    }

    try {
      uppy
        .upload()
        .then(async (response: any) => {
          if (response.successful.length === 1) {
            const { uploadURL, name } = response.successful[0];
            setPictureUrlState(uploadURL);

            const res = await apiFetcher(urls.userInfos.updateUser, {
              method: 'PUT',
              body: JSON.stringify({
                data: {
                  attributes: {
                    avatar: {
                      id: uploadURL,
                      storage: 'cache',
                      url: uploadURL,
                      metadata: { filename: name },
                    },
                  },
                },
              }),
            });

            setUserInfos({
              id: user?.id || '',
              email: user?.email || '',
              first_name: user?.first_name || '',
              last_name: user?.last_name || '',
              u_at: user?.u_at || '',
              c_at: user?.c_at || '',
              type: user?.type || '',
              avatar_data: {
                id: uploadURL,
                storage: 'cache',
                metadata: {
                  filename: name || '',
                  size: fileState?.size || 0,
                  mime_type: fileState?.type || 'image/jpeg',
                },
                url: res.data.attributes.avatar.url,
              },
            });
          }
          setFileUploading(false);
          enqueueSnackbar(t('settings.uploadSuccess'), {
            variant: 'success',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        })
        .catch(() => {
          setFileUploading(false);
          enqueueSnackbar(t('settings.uploadError'), {
            variant: 'error',
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
          });
        });
    } catch (error) {
      enqueueSnackbar(t('settings.errorUpload'), {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('settings.profileSettings')}</DialogTitle>

      <DialogContent>
        <Box textAlign="center">
          <IconButton
            aria-label="upload profile picture"
            component="label"
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              m: 'auto',
              borderRadius: 1.4,
              width: 150,
              height: 150,
              mb: 1,
              mt: 1,
              backgroundColor: theme.palette.primary.darker,
              '&:hover': {
                backgroundColor: theme.palette.primary.darker,
              },
            }}
          >
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />

            <Avatar
              src={user?.avatar_data?.url}
              alt="Profile Picture"
              sx={{ width: 150, height: 150, backgroundColor: 'transparent' }}
              variant="square"
            >
              {!user?.avatar_data.url && (
                <Typography variant="subtitle2" sx={{ color: theme.palette.action.active }}>
                  {userAvatar}
                </Typography>
              )}
            </Avatar>

            {fileUploading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
                  borderRadius: 1.4,
                }}
              >
                <CircularProgress size={40} sx={{ color: 'white' }} />
              </Box>
            )}
          </IconButton>
          <Button
            variant="outlined"
            component="label"
            sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1, minWidth: 180 }}
            disabled={fileUploading}
          >
            {fileUploading ? t('settings.uploading') : t('settings.uploadProfilePicture')}
            <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        {infosForm}
        {passwordForm}
        {languageField}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2">
          {t('settings.lightThemes')}
          <Iconify icon="fluent:weather-sunny-high-20-filled" width={24} height={24} ml={1} />
        </Typography>
        {themesSelection('light')}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2">
          {t('settings.darkThemes')}
          <Iconify icon="material-symbols-light:nights-stay" width={24} height={24} ml={1} />
        </Typography>
        {themesSelection('dark')}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          {t('global.cancel')}
        </Button>
        <Button onClick={onSubmitAccountInfos} variant="contained" color="success">
          {t('global.saveChanges')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
