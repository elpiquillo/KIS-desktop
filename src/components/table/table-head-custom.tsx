import { ListItemIcon } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { Theme, SxProps } from '@mui/material/styles';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { t } from 'i18next';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} as const;

// ----------------------------------------------------------------------

type Props = {
  order?: 'asc' | 'desc';
  orderBy?: string | number | null;
  headLabel: {
    id: string | number;
    name?: string;
    label?: string;
    align?: TableCellProps['align'];
    width?: string;
    minWidth?: string;
  }[];
  buttonAction?: { id: string }[];
  rowCount?: number;
  numSelected?: number;
  onSort?: (id: string | number) => void;
  onSelectAllRows?: (checked: boolean) => void;
  isActiveFilter?: (id: string) => boolean;
  handleOpenFilterModal?: (e: React.MouseEvent<HTMLElement>, id: string) => void;
  sx?: SxProps<Theme>;
};

export default function TableHeadCustom({
  order,
  orderBy,
  headLabel,
  buttonAction,
  rowCount = 0,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  isActiveFilter,
  handleOpenFilterModal,
  sx,
}: Props) {
  const filterIcon = (id: string) => {
    if (!isActiveFilter || !handleOpenFilterModal) return null;

    return (
      <ListItemIcon
        sx={{
          ml: 0.5,
          p: 0.5,
          borderRadius: '50%',
          cursor: 'pointer',
          color: isActiveFilter(id) ? 'white' : 'grey.600',
          backgroundColor: isActiveFilter(id) ? 'success.dark' : '',
        }}
        onClick={(e) => handleOpenFilterModal(e, id)}
      >
        <Iconify icon="mingcute:filter-2-fill" width={15} />
      </ListItemIcon>
    );
  };

  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onSelectAllRows(event.target.checked)
              }
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, minWidth: headCell.minWidth }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {onSort ? (
                <TableSortLabel
                  hideSortIcon
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : 'asc'}
                  onClick={() => onSort(headCell.id)}
                >
                  {headCell.label || headCell.name || headCell.id}

                  {orderBy === headCell.id ? (
                    <Box sx={{ ...visuallyHidden }}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label || headCell.name || headCell.id
              )}
              {filterIcon(headCell.id.toString())}
            </Box>
          </TableCell>
        ))}

        {buttonAction?.map((button) => <TableCell key={button.id}>{t('global.action')}</TableCell>)}
      </TableRow>
    </TableHead>
  );
}
