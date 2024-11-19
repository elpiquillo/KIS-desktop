import {
  Box,
  Button,
  ListItemIcon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import React, { Children } from 'react';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import { TableNoData } from 'src/components/table';
import FilterModal from './modal';

interface Props {
  blockInfo: any;
}

export default function TableView({ blockInfo }: Props) {
  const [columnForFilter, setColumnForFilter] = React.useState('');
  const { open, onOpen, onClose } = usePopover();
  const { data } = blockInfo.blocs[0];

  const maxRow =
    data.columns_content?.reduce(
      (acc: number, column: any) => (column.content.length > acc ? column.content.length : acc),
      0
    ) || 0; // fix by max len content in columns_content

  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>, id: number) => {
    const nameField = data.queries_dispatch[0].destination_fields[0].columns.find(
      (column: any) => column.id === id
    ).content;
    setColumnForFilter(nameField);
    onOpen(event);
  };

  const handleCloseFilter = () => {
    setColumnForFilter('');
    onClose();
  };

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
                      <ListItemIcon sx={{ m: 0 }} onClick={(e) => handleOpenFilter(e, column.id)}>
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
            {Children.toArray(
              Array.from({ length: maxRow }).map((_, index) => (
                <TableRow>
                  {data.columns_content.map((column: any) => (
                    <TableCell key={column.id}>
                      {column.content[index]?.column_content || ''}
                    </TableCell>
                  ))}
                  {data.button_action.map((button: any) => (
                    <TableCell key={button.id}>
                      <Button key={button.id} size="small" variant="outlined">
                        {button.text}
                      </Button>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
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

      <FilterModal
        block={blockInfo}
        nameColumn={columnForFilter}
        open={open}
        onClose={handleCloseFilter}
      />
    </Box>
  );
}
