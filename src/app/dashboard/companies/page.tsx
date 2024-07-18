import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import { Delegate, SponsorCompany } from '@prisma/client';
import CompaniesPageClient from '@/components/dashboard/companies/page-client';
import { allCompaniesUrl } from '@/globalConstants';

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
  const res = await fetch(allCompaniesUrl, { cache: 'no-store' })
  const companies = await res.json()
  return companies
}

export default async function Page({ companies }: Props) {
  companies = await getCompanies();

  return <CompaniesPageClient companies={companies}/>
};