import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { DelegatesFilters } from '@/components/dashboard/delegates/delegates-filters';
import { DelegatesTable } from '@/components/dashboard/delegates/delegates-table';
import UploadList from '@/components/dashboard/overview/upload-list';
import { GetServerSideProps } from 'next';
import { Delegate } from '@prisma/client';
import PageClient from '@/components/dashboard/delegates/page-client';

type DelegateWithRelations = Delegate & {
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

async function getDelegates() {
  const res = await fetch(`http://localhost:3000/api/delegates`, { cache: 'no-store' })
  const delegates = await res.json()
  return delegates
}

export const metadata:Metadata = { title: `Delegates | Dashboard | ${config.site.name}` } satisfies Metadata;

export default async function Page({ delegates }: Props) {
  delegates = await getDelegates()

  return <PageClient delegates={delegates} />
}

