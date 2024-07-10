import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Delegate, SponsorCompany } from '@prisma/client';
import PaymentsPageClient from '@/components/dashboard/payments/page-client';

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
  payments = await getPayments();

  return <PaymentsPageClient payments={payments} />
};