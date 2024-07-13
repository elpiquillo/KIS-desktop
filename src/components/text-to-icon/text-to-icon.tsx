import { Tooltip } from "@mui/material";
import { t } from "i18next";
import { useMemo } from "react";
import Iconify from 'src/components/iconify';

export default function TextToIcon({ text }: { text: string }) {
  const textDispatch = useMemo(() => ({
    Numeric: 'tabler:number-123',
    String: 'eva:text-outline',
    Boolean: 'eva:checkmark-outline',
    Image: 'eva:image-outline',
    document: 'eva:file-text-outline',
    Date: 'eva:calendar-outline',
    protected: 'eva:lock-outline',
    undefined: 'eva:hash-outline',
  }), []);

  const iconSelect = useMemo(() => (
    textDispatch[text as keyof typeof textDispatch] || 'eva:hash-outline'
  ), [text, textDispatch]);

  return (
    <Tooltip title={t(`global.${text}`)}>
      <Iconify icon={iconSelect} width={16} color="grey.500" />
    </Tooltip>
  );
}
