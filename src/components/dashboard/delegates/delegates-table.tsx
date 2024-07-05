'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { useSelection } from '@/hooks/use-selection';

export interface Delegate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  sponsorCompany: {
    companyName: string;
  };
  payment: {
    paymentMode: string;
    amount: number;
    currency: string;
  }[];
  createdAt: Date;
}

interface DelegatesTableProps {
  count?: number;
  page?: number;
  rows?: Delegate[];
  rowsPerPage?: number;
}

function noop(): void {
  // do nothing
}

export function DelegatesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: DelegatesTableProps): React.JSX.Element {
  
  
  const rowIds = React.useMemo(() => {
    return rows.map((delegate) => delegate.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Signed Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);
              console.log('rows',row.payment[0]?.paymentMode);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.jobTitle}</TableCell>
                  <TableCell>{row.sponsorCompany?.companyName}</TableCell>
                  <TableCell>{row.payment[0]?.paymentMode}</TableCell>
                  <TableCell>{row.payment[0]?.amount}</TableCell>
                  <TableCell>{row.payment[0]?.currency}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

export default function DelegatesPage(): React.JSX.Element {
  const [delegates, setDelegates] = React.useState<Delegate[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/delegates');
      const data = await response.json();
      setDelegates(data);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <DelegatesTable rows={delegates} count={delegates.length} rowsPerPage={10} page={0} />;
}
