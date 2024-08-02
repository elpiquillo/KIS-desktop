import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { paths } from "src/routes/paths";
import { t } from "i18next";
import { RouterLink } from "src/routes/components";
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, IconButton, InputAdornment } from "@mui/material";
import Iconify from "src/components/iconify";
import { useForm } from "react-hook-form";
import { useBoolean } from 'src/hooks/use-boolean';
import { useLogin } from 'src/auth/useLogin';

export default function LoginView() {
  const password = useBoolean();
  const { login } = useLogin();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required(t('global.emailRequired')).email(t('global.emailInvalid')),
    password: Yup.string().required(t('auth.passwordRequired'))
  });

  const defaultValues = {
    email: 'modez.martin@getkis.io',
    password: 'aaaaaaaa',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      // Add your error handling logic here
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">
        {t("auth.loginPage.title")}
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField name="email" label="Email address" />

      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} color='grey.400' />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        variant="text"
        component={RouterLink}
        size="small"
        href={paths.auth.forgotPassword}
        color='success'
        sx={{ alignSelf: 'flex-end', paddingTop: 0}}
      >
        {t("auth.loginPage.forgotPassword")}
      </Button>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
        sx={{ justifyContent: 'space-between', pl: 2, pr: 1.5 }}
      >
        {t('auth.loginPage.action')}
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
}