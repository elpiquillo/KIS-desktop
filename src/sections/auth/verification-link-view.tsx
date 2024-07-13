import { Button, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import EmptyContent from "src/components/empty-content";
import { RouterLink } from "src/routes/components";
import { paths } from "src/routes/paths";

export default function VerificationLinkView() {

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <EmptyContent imgUrl="/assets/icons/empty/ic_email_selected.svg" sx={{ alignItems: 'left' }}/>

      <Typography variant="h4">
        {t("auth.verificationLinkPage.title")}
      </Typography>
      <Typography variant="body2">
        {t("auth.verificationLinkPage.subTitle")}
      </Typography>

      <Button
        fullWidth
        color="inherit"
        size="large"
        component={RouterLink}
        href={paths.auth.login}
        variant="outlined"
      >
        {t('auth.verificationLinkPage.action')}
      </Button>
    </Stack>
  );

  return renderHead;
};
