import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

interface Delegate {
  id: number;
  category: string;
  fullName: string;
  email: string;
  phone: string;
  ihrmNumber: string;
  jobTitle: string;
  companyId: number;
  paymentId: number;
  createdAt: Date;
  updatedAt: Date;
  payment: {
      id: number;
      paymentMode: string;
      amount: number;
      currency: string;
      paymentReferenceCode: string;
      createdAt: Date;
      updatedAt: Date;
  };
}

interface Company {
  id: number;
  companyName: string;
  employeeCount: number | null;
  contactPersonName: string | null;
  contactPersonEmail: string | null;
  contactPersonPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
  delegates: Delegate[];
}

interface AggregatedCompany extends Omit<Company, 'delegates'> {
  delegateCount: number;
  totalAmountPaid: number;
  delegates: Delegate[];
}

const companies: Company[] = [/* your companies data here */];

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get all companies
      const companies = await prisma.sponsorCompany.findMany({
        include: {
          delegates: {
            include: {
              payment: true,
            },
          }
        },
      });
      console.log('createdAt', typeof(companies[0].createdAt));
      

      const companiesWithAggregates = companies.reduce<{ [key: string]: AggregatedCompany }>((acc, company) => {
        const companyName = company.companyName;
        if (!acc[companyName]) {
            acc[companyName] = {
                ...company,
                delegateCount: 0,
                totalAmountPaid: 0,
                delegates: []
            };
        }
    
        acc[companyName].delegateCount += company.delegates.length;
        acc[companyName].totalAmountPaid += company.delegates.reduce((total, delegate) => {
            return total + (delegate.payment?.amount || 0);
        }, 0);
    
        acc[companyName].delegates.push(...company.delegates);
    
        return acc;
    }, {});
    
    const aggregatedCompanies = Object.values(companiesWithAggregates);
    
    //console.log(aggregatedCompanies)

      res.status(200).send(aggregatedCompanies);
    } catch (error) {
      res.status(500).json({error: 'Failed to fetch data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
