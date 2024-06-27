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


async function getCompanies() {
  const res = await fetch(`http://localhost:3000/api/companies`, { cache: 'no-store' })
  const companies = await res.json()
  return companies
}

export default async function Page({ companies }: Props) {
  const page = 0;
  const rowsPerPage = 10;
  companies = await getCompanies()
  const paginatedcompanies = applyPagination(companies || [], page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Companies</Typography>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <CompaniesFilters />
      <CompaniesTable
        count={paginatedcompanies.length}
        page={page}
        rows={paginatedcompanies}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: CompanyWithDelegates[], page: number, rowsPerPage: number): CompanyWithDelegates[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}