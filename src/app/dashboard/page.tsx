import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Delegates } from '@/components/dashboard/overview/delegates';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Signups } from '@/components/dashboard/overview/signups';
import { TotalCompanies } from '@/components/dashboard/overview/total-companies';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { FullPayments } from '@/components/dashboard/overview/full-payments';
import { PartialPayments } from '@/components/dashboard/overview/partial-payments';
import { promises as fs } from 'fs';
import UploadList from '@/components/dashboard/overview/upload-list';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

// Define types for the data
interface Payment {
  Id: number;
  PaymentMode: string;
  Amount: number;
  Currency: string;
  PaymentReferenceCode: string;
  createdAt: string;
  updatedAt: string;
}
interface DataProps {
  delegatesCount: number;
  totalCompaniesCount: number;
  fullPaymentCount: number;
  partialPaymentsCount: number;
  fullPaymentSum: number;
  partialPaymentSum: number;
  paymentSum: number;
}

const fetchData = async (): Promise<DataProps> => {
  const endpoints = {
    delegates: 'http://localhost:6001/api/delegates',
    totalCompanies: 'http://localhost:6001/api/companies',
    totalPayments: 'http://localhost:6001/api/payments',
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

  const [delegates, totalCompanies, totalPayments] = await Promise.all([
    fetchEndpoint(endpoints.delegates),
    fetchEndpoint(endpoints.totalCompanies),
    fetchEndpoint(endpoints.totalPayments),
  ]);
  const delegatesCount = delegates.length;
  const totalCompaniesCount = totalCompanies.length;
  const fullPaymentCount = totalPayments.length;

  const fullPayment = 80000;
  let fullPaymentSum = 0;
  let partialPaymentSum = 0;
  let allPaymentSum = 0;

  totalPayments.forEach((payment: any) => {
    if (payment.Amount === fullPayment) {
      fullPaymentSum += payment.Amount;
    } else if (payment.Amount < fullPayment) {
      partialPaymentSum += payment.Amount;
    }
    allPaymentSum += payment.Amount;
  });
  
  const partialPaymentsCount = totalPayments.filter((payment: Payment) => payment.Amount < fullPayment).length;

  return {
    delegatesCount,
    totalCompaniesCount,
    fullPaymentCount,
    partialPaymentsCount,
    fullPaymentSum:fullPaymentSum,
    partialPaymentSum:partialPaymentSum,
    paymentSum:allPaymentSum,
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
      <Grid lg={8} xs={12}>
        <Signups
          chartSeries={[
            { name: 'Signups', data: [18, 16, 5, 8, 3, 14, 14] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              customer: { name: 'Ekaterina Tankova' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-006',
              customer: { name: 'Cao Yu' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-004',
              customer: { name: 'Alexa Richardson' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-003',
              customer: { name: 'Anje Keizer' },
              amount: 96.43,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-002',
              customer: { name: 'Clarke Gillebert' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-001',
              customer: { name: 'Adam Denisov' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}

export default Page;
