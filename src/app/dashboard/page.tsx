import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Delegates } from '@/components/dashboard/overview/delegates';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Payments } from '@/components/dashboard/overview/payments';
import { TotalCompanies } from '@/components/dashboard/overview/total-companies';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { FullPayments } from '@/components/dashboard/overview/full-payments';
import { PartialPayments } from '@/components/dashboard/overview/partial-payments';
import { promises as fs } from 'fs';
import UploadList from '@/components/dashboard/overview/upload-list';
import { DelegatesChart } from '@/components/dashboard/overview/delegatesChart';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

// Define types for the data
interface Payment {
  id: number;
  paymentMode: string;
  amount: number;
  currency: string;
  paymentReferenceCode: string;
  createdAt: string;
  updatedAt: string;
  delegateId: number;
}
interface DataProps {
  delegatesCount: number;
  totalCompaniesCount: number;
  fullPaymentCount: number;
  partialPaymentsCount: number;
  fullPaymentSum: number;
  partialPaymentSum: number;
  paymentSum: number;
  paymentsbyMonth: number[]
}

const fetchData = async (): Promise<DataProps> => {
  const endpoints = {
    delegates: 'http://localhost:3000/api/delegates',
    totalCompanies: 'http://localhost:3000/api/companies',
    totalPayments: 'http://localhost:3000/api/payments?endpoint=getAllPayments',
    groupedPayments: 'http://localhost:3000/api/payments?endpoint=getPaymentsBy',
  };

  const fetchEndpoint = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }
    return response.json();
  };
  
  const [delegates, totalCompanies, totalPayments, groupedPayments] = await Promise.all([
    fetchEndpoint(endpoints.delegates),
    fetchEndpoint(endpoints.totalCompanies),
    fetchEndpoint(endpoints.totalPayments),
    fetchEndpoint(endpoints.groupedPayments),
  ]);

  const paymentsbyMonth = Object.values(groupedPayments).map(item => item.totalAmount)
  // console.log('paymentsbyMonth', paymentsbyMonth)
  const delegatesCount = delegates.length;
  const totalCompaniesCount = totalCompanies.length;
  const fullPaymentCount = totalPayments.filter((payment: Payment) => payment.amount >= 80000).length;

  const fullPayment = 80000;
  let fullPaymentSum = 0;
  let partialPaymentSum = 0;
  let allPaymentSum = 0;

  totalPayments.forEach((payment: any) => {
    if (payment.amount === fullPayment) {
      fullPaymentSum += payment.amount;
    } else if (payment.amount < fullPayment) {
      partialPaymentSum += payment.amount;
    }
    allPaymentSum += payment.Amount;
  });
  
  const partialPaymentsCount = totalPayments.filter((payment: Payment) => payment.amount < fullPayment).length;
  
  return {
    delegatesCount,
    totalCompaniesCount,
    fullPaymentCount,
    partialPaymentsCount,
    fullPaymentSum:fullPaymentSum,
    partialPaymentSum:partialPaymentSum,
    paymentSum:allPaymentSum,
    paymentsbyMonth: paymentsbyMonth
  };
};
const Page = async () =>  {
  const dataPromise = fetchData();

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Content dataPromise={dataPromise} />
    </React.Suspense>
  );
};

const Content = async ({ dataPromise }: { dataPromise: Promise<DataProps> }) => {
  const data = await dataPromise;

  // const file = await fs.readFile(process.cwd() + '/app/data.xlsx', 'utf8');

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Delegates diff={12} trend="up" sx={{ height: '100%' }} value={data.delegatesCount} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCompanies diff={16} trend="down" sx={{ height: '100%' }} value={data.totalCompaniesCount} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <FullPayments sx={{ height: '100%' }} value={data.fullPaymentCount} sum={data.fullPaymentSum} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <PartialPayments sx={{ height: '100%' }} value={data.partialPaymentsCount} sum={data.partialPaymentSum} />
      </Grid>
      <Grid lg={6} xs={12}>
        <Payments
          chartSeries={[
            { name: 'Payments', data: data.paymentsbyMonth },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={6} xs={12}>
        <DelegatesChart
          chartSeries={[
            { name: 'Payments', data: data.paymentsbyMonth },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}

export default Page;
