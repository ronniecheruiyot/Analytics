'use client';
import * as React from 'react';
import type { Metadata } from 'next';
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
import { exportToExcel } from '@/utils/exportToExcel';

export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

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

type CompanyWithDelegates = SponsorCompany & {
  delegates: DelegateWithRelations[];
};

type Props = {
  companies: CompanyWithDelegates[];
};

export default function CompaniesPageClient({ companies:initialCompanies }: Props) {
  const [companies, setCompanies] = React.useState<CompanyWithDelegates[]>(initialCompanies);
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
    exportToExcel(companies, 'Companies');
  };

  const paginatedCompanies = applyPagination(companies || [], page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Companies</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" onClick={handleExport} />}>
              Export
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <CompaniesFilters />
      <CompaniesTable
        count={companies.length}
        page={page}
        rows={paginatedCompanies}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Stack>
  );
}

function applyPagination(rows: CompanyWithDelegates[], page: number, rowsPerPage: number): CompanyWithDelegates[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}