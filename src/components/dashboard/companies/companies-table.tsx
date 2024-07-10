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

export interface Companies {
  id: string;
  companyName: string;
  employeeCount: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  delegates: {
    payment: {
      amount: number;
      paymentMode: string,
    }[];
  }[];
  delegateCount: number;
  totalAmountPaid: number;
  createdAt: Date;
}


interface CompaniesTableProps {
  count?: number;
  page?: number;
  rows?: Companies[];
  rowsPerPage?: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompaniesTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
}: CompaniesTableProps): React.JSX.Element {
  
  const rowIds = React.useMemo(() => {
    return rows.map((Companies) => Companies.id);
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
              <TableCell>Id</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Employee Count</TableCell>
              <TableCell>Total Amount Paid</TableCell>
              <TableCell>Payment Mode</TableCell>
              <TableCell>Date Paid</TableCell>
              <TableCell>Contact Person Name</TableCell>
              <TableCell>Contact Person Email</TableCell>
              <TableCell>Contact Person Phone</TableCell>
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
                  <TableCell>{row.companyName}</TableCell>
                  <TableCell>{row.delegateCount}</TableCell>
                  <TableCell>{row.totalAmountPaid}</TableCell>
                  <TableCell>{row.delegates[0]?.payment[0]?.paymentMode}</TableCell>
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>{row.contactPersonName}</TableCell>
                  <TableCell>{row.contactPersonEmail}</TableCell>
                  <TableCell>{row.contactPersonPhone}</TableCell>
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
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}

export default function CompaniesPage(): React.JSX.Element {
  const [Companies, setCompanies] = React.useState<Companies[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/Companies');
      const data = await response.json();
      setCompanies(data);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <CompaniesTable rows={Companies} count={Companies.length} rowsPerPage={10} page={0} />;
}
