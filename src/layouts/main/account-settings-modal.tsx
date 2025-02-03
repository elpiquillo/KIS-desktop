import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import i18next, { t } from 'i18next';
import { Divider, Grid, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useUserState } from 'src/store/userState';
import { usePutPassword, usePutUserInfos } from 'src/apis/account';
import { useBoolean } from 'src/hooks/use-boolean';
import { changeLanguage } from 'src/locales/i18n';
import { languages } from 'src/locales/config-lang';
import themesColor from 'src/utils/themes-color';
import { useThemeMode } from 'src/theme/ThemeModeContext';
import useThemeStore from 'src/store/themeModeState';

interface ModalProps {
  open: boolean;
  onClose: () => void; // Add the onClose property
}

// ----------------------------------------------------------------------

export function AccountSettingsModal({ open, onClose }: ModalProps) {
  const { putUserInfos } = usePutUserInfos();
  const { putPassword } = usePutPassword();
  const { paletteMode, togglePaletteMode } = useThemeMode();
  const { enqueueSnackbar } = useSnackbar();

  const { setThemeName } = useThemeStore();

  const password = useBoolean();
  const passwordConfirmation = useBoolean();

  const user = useUserState((s) => s.userInfos);

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

  const setNewTheme = (theme: string) => () => {
    setThemeName(theme);

    const isDarkTheme = theme.includes('Dark');
    const isLightMode = paletteMode === 'light';
    const isDarkMode = paletteMode === 'dark';

    if (isDarkTheme && isLightMode) {
      togglePaletteMode();
    } else if (!isDarkTheme && isDarkMode) {
      togglePaletteMode();
    }

    document.body.style.background = themesColor[theme as keyof typeof themesColor].app_background;

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('settings.profileSettings')}</DialogTitle>

      <DialogContent>
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
