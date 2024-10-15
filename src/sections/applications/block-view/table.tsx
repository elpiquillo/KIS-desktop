import {
  Box,
  Button,
  ListItemIcon,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import React from 'react';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { TableNoData } from 'src/components/table';

interface Props {
  blockInfo: any;
}

export default function TableView({ blockInfo }: Props) {
  const { open, onOpen, onClose } = usePopover();
  const { data } = blockInfo.blocs[0];

  return (
    <Box>
      <Box sx={{ height: '36px', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle1">{data.card_title}</Typography>
        {data.button_export && (
          <Button disabled variant="outlined">
            {t('applications.exportCsv')}
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table size="small" data-testid="table">
          <TableHead>
            <TableRow>
              {data.columns.map((column: any) => (
                <TableCell key={column.id}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Typography variant="subtitle2">{column.name}</Typography>
                    {data.allow_filters && (
                      <ListItemIcon sx={{ m: 0 }} onClick={onOpen}>
                        <Iconify icon="mingcute:filter-2-fill" width={15} />
                      </ListItemIcon>
                    )}
                  </Box>
                </TableCell>
              ))}
              {data.button_action.map((button: any) => (
                <TableCell key={button.id}>{t('global.action')}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {[1, 2, 3].map((row: number) => (
              <TableRow key={row}>
                {data.columns.map((column: any) => (
                  <TableCell key={column.id}>{t('applications.content')}</TableCell>
                ))}
                {data.button_action.map((button: any) => (
                  <TableCell key={button.id}>
                    <Button key={button.id} size="small" variant="outlined">
                      {button.text}
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {!data.columns.length && !data.button_action.length && (
              <TableNoData
                notFound
                title={t('applications.editForm.noColumnsAdded')}
                imgUrl="/assets/icons/empty/ic_content.svg"
                sx={{ height: '180px' }}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Popover
        open={!!open}
        onClose={onClose}
        anchorEl={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Stack width={200}>
          <Stack p={1}>
            <TextField
              fullWidth
              name="filter_operator"
              size="small"
              margin="none"
              variant="outlined"
              type="text"
            />
          </Stack>
          <Stack p={1} flexDirection="row">
            <TextField
              fullWidth
              name="filter_value"
              size="small"
              margin="none"
              variant="outlined"
              type="text"
            />
          </Stack>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} p={1}>
            <Button fullWidth variant="outlined">
              {t('applications.filter')}
            </Button>
            <Button fullWidth variant="outlined" color="error">
              {t('applications.delete')}
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Box>
  );
}
