import React from 'react';
import { Button, Dialog } from '@mui/material';
import { t } from 'i18next';
import { useBoolean } from 'src/hooks/use-boolean';

interface Props {
  link: string;
  name: string;
}

export default function PdfReader({ link, name }: Props) {
  const modal = useBoolean();

  return (
    <>
      <Button
        onClick={modal.onTrue}
        sx={{
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
          },
          '&:focus': {
            outline: 'none',
          },
        }}
      >
        {name}
      </Button>
      <Dialog open={modal.value} onClose={modal.onFalse} fullWidth maxWidth="md">
        <object data={link} type="application/pdf" width="100%" height="560px">
          <p>{t('component.failedLoadPdf')}</p>
        </object>
      </Dialog>
    </>
  );
}
