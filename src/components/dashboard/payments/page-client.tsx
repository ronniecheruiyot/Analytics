'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { config } from '@/config';
import { CompaniesFilters } from '@/components/dashboard/companies/companies-filters';
import { Delegate, SponsorCompany } from '@prisma/client';
import { PaymentsTable } from '@/components/dashboard/payments/payments-table';
import { exportToExcel } from '@/utils/exportToExcel';

export const metadata = { title: `Payments | Dashboard | ${config.site.name}` } satisfies Metadata;

type DelegateWithRelations = Delegate & {
  sponsorCompany: {
    companyName: string;
  };
  payment: {
    paymentMode: string;
    amount: number;
    currency: string;
  };
};

type PaymentWithDelegates = SponsorCompany & {
  delegates: DelegateWithRelations[];
};

type Props = {
  payments: PaymentWithDelegates[];
};


async function getPayments() {
  const res = await fetch(`http://localhost:3000/api/payments?endpoint=getAllPayments`, { cache: 'no-store' })
  const payments = await res.json()
  return payments
}

export default function PaymentsPageClient({ payments: initialPayments }: Props) {
  const [payments, setPayments] = React.useState<PaymentWithDelegates[]>(initialPayments);
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
    exportToExcel(payments, 'Payments');
  };

  const paginatedPayments = applyPagination(payments || [], page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Payments</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" onClick={handleExport} startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <CompaniesFilters />
      <PaymentsTable
        count={payments.length}
        page={page}
        rows={paginatedPayments}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Stack>
  );
}

function applyPagination(rows: PaymentWithDelegates[], page: number, rowsPerPage: number): PaymentWithDelegates[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}