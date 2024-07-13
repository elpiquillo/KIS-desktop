import { Box, Button, Card, CardHeader, Skeleton, Table, TableBody, TableContainer } from "@mui/material";
import TableSkeleton from "../table/table-skeleton";

export default function TableViewSkeleton() {
  return (
  <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
    <CardHeader
      title={(
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={100} height={60} />
      )}
      sx={{ mb: 2 }}
      action={
        <>
          <Button>
            <Skeleton variant="text" width={210} height={60} />
          </Button>
          <Button>
            <Skeleton variant="text" width={210} height={60} />
          </Button>
          <Button>
          <Skeleton variant="circular" width={40} height={40} />
          </Button>            
        </>
      }
    />
    <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
    <TableContainer>
      <Table>
        <TableBody>
        <TableSkeleton numRows={3} type="database" />
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
  </Card>
)};
