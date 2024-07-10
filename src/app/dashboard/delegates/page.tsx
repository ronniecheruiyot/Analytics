import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Delegate } from '@prisma/client';
import DelegatePageClient from '@/components/dashboard/delegates/page-client';

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
  const res = await fetch(`http://localhost:3000/api/delegates?endpoint=getAllDelegates`, { cache: 'no-store' })
  const delegates = await res.json()
  return delegates
}

export const metadata:Metadata = { title: `Delegates | Dashboard | ${config.site.name}` } satisfies Metadata;

export default async function Page({ delegates }: Props) {
  delegates = await getDelegates()

  return <DelegatePageClient delegates={delegates} />
}

