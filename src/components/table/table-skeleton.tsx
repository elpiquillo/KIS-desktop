import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

// ----------------------------------------------------------------------

interface TableSkeletonProps {
  numRows: number;
  type: 'applications' | 'users' | 'database' | 'automations';
}

interface SkeletonProps {
  image?: boolean;
  icon?: boolean;
  height: number;
  width: number;
  id: string;
}

const columnsApps: SkeletonProps[] = [
  { id: '1', height: 48, width: 48, image: true }, 
  { id: '2', height: 12, width: 300 },
  { id: '3', height: 12, width: 180 },
  { id: '4', height: 12, width: 160 },
  { id: '5', height: 12, width: 140 },
  { id: '6', height: 30, width: 40, icon: true },
];

const columnsUsers: SkeletonProps[] = [
  { id: '1', height: 12, width: 200 },
  { id: '2', height: 12, width: 200 },
  { id: '3', height: 12, width: 200 },
  { id: '4', height: 12, width: 160 },
  { id: '5', height: 30, width: 40, icon: true },
];

const columnsDatabase: SkeletonProps[] = [
  { id: '1', height: 12, width: 200 },
  { id: '2', height: 12, width: 200 },
  { id: '3', height: 12, width: 160 },
  { id: '4', height: 30, width: 40, icon: true },
];

const columnsAutomations: SkeletonProps[] = [
  { id: '1', height: 12, width: 200 },
  { id: '2', height: 12, width: 200 },
  { id: '3', height: 12, width: 160 },
  { id: '4', height: 30, width: 40, icon: true },
];

const columnsDispatch: { [key: string]: SkeletonProps[] } = {
  applications: columnsApps,
  users: columnsUsers,
  database: columnsDatabase,
  automations: columnsAutomations,
};

const getColumValue = (type: string) => columnsDispatch[type];

// ----------------------------------------------------------------------

export default function TableSkeleton({ numRows, type }: TableSkeletonProps) {
  const columns = getColumValue(type);

  return (
    <>
      {Array.from({ length: numRows }, (_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {columns.map((column) => (
            <TableCell key={column.id} style={{ width: column.width }}>
              <Skeleton
                sx={{
                  borderRadius: column.icon ? 30 : 1.5,
                  width: column.image || column.icon ? column.height : '100%',
                  height: column.height,
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
