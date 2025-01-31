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
import { allCompaniesUrl, allDelegatesUrl, allPaymentsUrl, groupedCompanyCountBymonthUrl, groupedDelegatesByMonthUrl, groupedPaymentsCountByMonthUrl } from '@/globalConstants';

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
  paymentsbyMonth: number[];
  delegatesByMonth: number[];
  groupedCompanyCountBymonth: Array<number>;
}

const fetchData = async (): Promise<DataProps> => {
  const endpoints = {
    delegates: allDelegatesUrl,
    groupedDelegates: groupedDelegatesByMonthUrl,
    totalCompanies: allCompaniesUrl,
    groupedCompanyCountBymonth: groupedCompanyCountBymonthUrl,
    totalPayments: allPaymentsUrl,
    groupedPayments: groupedPaymentsCountByMonthUrl,
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
  
  const [delegates, totalCompanies, totalPayments, groupedPayments, groupedDelegates, groupedCompanyCountBymonth] = await Promise.all([
    fetchEndpoint(endpoints.delegates),
    fetchEndpoint(endpoints.totalCompanies),
    fetchEndpoint(endpoints.totalPayments),
    fetchEndpoint(endpoints.groupedPayments),
    fetchEndpoint(endpoints.groupedDelegates),
    fetchEndpoint(endpoints.groupedCompanyCountBymonth)
  ]);

  const paymentsbyMonth = Object.values(groupedPayments).map(item => item.totalAmount)
  const delegatesByMonth = Object.values(groupedDelegates).map(item => item.totalDelegates)
  const companiesByMonth = Object.values(groupedCompanyCountBymonth).map(item => item.totalCompanies)

  // console.log('paymentsbyMonth', paymentsbyMonth)
  const delegatesCount = delegates.length;
  const totalCompaniesCount = totalCompanies.length;


  const fullPayment = 80000;
  // let allPaymentSum = 0;
  // let partialPaymentSum = 0;

 /**
   * Group Delegate payments logic
   * 
   * 1. Loop through all payments
   * 2. Get delegateId and Amount and push to an array of objects
   * 3. If delegateId already exists in the array, increment the amount otherwise, add a new entry.
   */
  const delegatePayments = totalPayments.reduce((acc, payment: Payment) => {
    const key = payment.delegateId

    //New entry, insert delegate Id and the payment amount
    if(!acc[key]){
      acc[key] = {
        delegateId: key,
        totalAmount: payment.amount
      }
    }else{
      //If delegate Id exists in our array, only increment the total Amount
      acc[key].totalAmount += payment.amount
      
    }
    return acc
  }, []);
  // console.log("delegatePayments!!!!!", delegatePayments)

  //AllPayments
  const allPaymentSum = delegatePayments.reduce((accumulator, obj) =>{
    return accumulator += obj.totalAmount
  }, 0)
  // console.log("allPaymentSum", paymentSum)


  //Get count of paymentTotal adding up or >= than 80,000
  const fullPayments = delegatePayments.filter(item => item.totalAmount >= fullPayment)
  // console.log("fullPayments", fullPayments)
  const fullPaymentCount = fullPayments.length
  const fullPaymentSum = fullPayments.reduce((accumulator, obj) =>{
    return accumulator += obj.totalAmount
  }, 0)


  //This gets partial payments count sum by delegate
  const partialPayments = delegatePayments.filter(item => item.totalAmount < fullPayment)
  // console.log("partialPayments", partialPayments)
  const partialPaymentsCount = partialPayments.length
  const partialPaymentSum = partialPayments.reduce((accumulator, obj) =>{
    return accumulator += obj.totalAmount
  }, 0)

  /**
   * Get partial payments logic
   * 
   * 1. Loop through all payments
   * 2. Get delegateId and Amount and push to an array of objects
   * 3. If delegateid already exists in the array, increment the amount otherwise, add a new entry.
   * 4. Get count of paymentTotal adding up or > than 80,000
   */




  // totalPayments.forEach((payment: any) => {
  //   // if (payment.amount === fullPayment) {
  //   //   fullPaymentSum += payment.amount;
  //   // } else 
  //   if (payment.amount < fullPayment) {
  //     partialPaymentSum += payment.amount;
  //   }
  //   // allPaymentSum += payment.Amount;
  // });
  
  //This counts all payment < 80000
  // const partialPaymentsCount = totalPayments.filter((payment: Payment) => payment.amount < fullPayment).length;

  return {
    delegatesCount,
    totalCompaniesCount,
    fullPaymentCount,
    partialPaymentsCount,
    fullPaymentSum:fullPaymentSum,
    partialPaymentSum:partialPaymentSum,
    paymentSum:allPaymentSum,
    paymentsbyMonth: paymentsbyMonth,
    delegatesByMonth: delegatesByMonth,
    groupedCompanyCountBymonth: companiesByMonth
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
  const delegatesBymonth = data.delegatesByMonth
  const companiesBymonth = data.groupedCompanyCountBymonth
  const month = new Date().getMonth()
  // console.log("month", month, delegatesBymonth)

  const currMonthDelegateCount = delegatesBymonth[month]
  const prevMonthDelegateCount = delegatesBymonth[month-1]
  const delDiff = currMonthDelegateCount - prevMonthDelegateCount
  const delAvg = (currMonthDelegateCount + prevMonthDelegateCount) / 2
  const perDelDiff = (delDiff / prevMonthDelegateCount) * 100

  const currMonthCompaniesCount = companiesBymonth[month]
  const prevMonthCompaniesCount = companiesBymonth[month-1]
  const diff = currMonthCompaniesCount - prevMonthCompaniesCount
  const avg = (currMonthCompaniesCount + prevMonthCompaniesCount) / 2
  const perDiff = (diff / prevMonthCompaniesCount) * 100

  // console.log("companies@!!!", prevMonthCompaniesCount, currMonthCompaniesCount,diff, perDiff)

  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Delegates diff={perDelDiff} trend={perDelDiff < 0 ? "down" : "up"} sx={{ height: '100%' }} value={data.delegatesCount} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalCompanies diff={perDiff} trend={perDiff < 0 ? "down" : "up"} sx={{ height: '100%' }} value={data.totalCompaniesCount} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <FullPayments sx={{ height: '100%' }} value={data.fullPaymentCount} sum={data.fullPaymentSum} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <PartialPayments sx={{ height: '100%' }} value={data.partialPaymentsCount} sum={data.partialPaymentSum} />
      </Grid>
      <Grid lg={6} xs={12}>
        <DelegatesChart
          chartSeries={[
            { name: 'Delegates', data: data.delegatesByMonth },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={6} xs={12}>
        <Payments
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
