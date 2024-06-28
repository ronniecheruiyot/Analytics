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

export interface Payments {
  id: string;             
  paymentMode: string;         
  amount: number;
  currency: string;
  paymentReferenceCode: string;
  delegates: {
    email: string;
    sponsorcompany: {
      companyName: string;
    };
  }[];
  createdAt: Date;
}


interface PaymentsTableProps {
  count?: number;
  page?: number;
  rows?: Payments[];
  rowsPerPage?: number;
}

function noop(): void {
  // do nothing
}

export function PaymentsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: PaymentsTableProps): React.JSX.Element {
  
  const rowIds = React.useMemo(() => {
    return rows.map((Payments) => Payments.id);
  }, [rows]);
  console.log('payment rows', rows);
  

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
              <TableCell>Id</TableCell>
              <TableCell>Payment Reference</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Delegate Email</TableCell>
              <TableCell>Company Name</TableCell>
              {/* <TableCell>Payment Status</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

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
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.paymentReferenceCode}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.currency}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.delegates[0]?.email}</TableCell>
                  <TableCell>{row.delegates[0]?.sponsorcompany?.companyName}</TableCell>
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

export default function CompaniesPage(): React.JSX.Element {
  const [Payments, setPayments] = React.useState<Payments[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/Payments');
      const data = await response.json();
      setPayments(data);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <PaymentsTable rows={Payments} count={Payments.length} rowsPerPage={10} page={0} />;
}
