import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { IntegrationCard } from '@/components/dashboard/companies/companies-card';
import type { Integration } from '@/components/dashboard/companies/companies-card';
import { CompaniesFilters } from '@/components/dashboard/companies/companies-filters';
import { Delegate, SponsorCompany } from '@prisma/client';
import { CompaniesTable } from '@/components/dashboard/companies/companies-table';
import { PaymentsTable } from '@/components/dashboard/payments/payments-table';

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

export default async function Page({ payments }: Props) {
  const page = 0;
  const rowsPerPage = 10;
  payments = await getPayments()
  const paginatedcompanies = applyPagination(payments || [], page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Payments</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <CompaniesFilters />
      <PaymentsTable
        count={paginatedcompanies.length}
        page={page}
        rows={paginatedcompanies}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: PaymentWithDelegates[], page: number, rowsPerPage: number): PaymentWithDelegates[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}