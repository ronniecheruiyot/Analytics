'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';

import { DelegatesFilters } from '@/components/dashboard/delegates/delegates-filters';
import { DelegatesTable } from '@/components/dashboard/delegates/delegates-table';
import UploadList from '@/components/dashboard/overview/upload-list';
import { exportToExcel } from '@/utils/exportToExcel';

type DelegateWithRelations = {
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
  };
  createdAt: Date;
};

type Props = {
  delegates: DelegateWithRelations[];
};

export default function DelegatePageClient({ delegates: initialDelegates }: Props) {
  const [delegates, setDelegates] = React.useState<DelegateWithRelations[]>(initialDelegates);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page whenever rows per page changes
  };

  const handleExport = () => {
    exportToExcel(delegates, 'Delegates');
  };

  const paginatedDelegates = applyPagination(delegates || [], page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Delegates</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <UploadList />
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" onClick={handleExport}/>}>
              Export
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <DelegatesFilters />
      <DelegatesTable
        count={delegates.length}
        page={page}
        rows={paginatedDelegates}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Stack>
  );
}

function applyPagination(rows: DelegateWithRelations[], page: number, rowsPerPage: number): DelegateWithRelations[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
