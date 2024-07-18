import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { startOfYear, endOfYear, eachMonthOfInterval, format } from 'date-fns';

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
  // payment: {
  //     id: number;
  //     paymentMode: string;
  //     amount: number;
  //     currency: string;
  //     paymentReferenceCode: string;
  //     createdAt: Date;
  //     updatedAt: Date;
  // };
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
  const {method, query: {endpoint, from, to}} = req

  switch (endpoint){
    case "getAllCompanies":
      if (method === 'GET') {
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
      break;

      case "listCompaniesBetweenDates":
      if (method === 'GET') {
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
            where: {
              createdAt: {
                gte: new Date(from).toISOString(),
                lte: new Date(to).toISOString()
              }
            }
          });
          
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
      break;
    
    case "getCompaniesBymonth":
      if(method === 'GET'){
        const currentYear = new Date().getFullYear();
        const monthsOfYear = eachMonthOfInterval({
          start: startOfYear(new Date(currentYear, 0, 1)),
          end: endOfYear(new Date(currentYear, 11, 31)),
        });

        try {
          const orderedCompanies = await prisma.sponsorCompany.groupBy({
            by: ['createdAt'],
            where: {
              createdAt: {
                gte: startOfYear(new Date(currentYear, 0, 1)),
                lte: endOfYear(new Date(currentYear, 11, 31)),
              },
            },
            orderBy: {
              createdAt: 'asc'
            }
          })
          console.log("orderedCompanies", orderedCompanies)

          const groupCompaniesByMonth = orderedCompanies.reduce((acc, curr) => {
            const month = curr.createdAt.getMonth() + 1; // getMonth() is zero-based, so add 1
            const year = curr.createdAt.getFullYear();
            const key = `${year}-${month.toString().padStart(2, '0')}`;
      
            // console.log("@@@@curr!!!!!", curr)
            if(!acc[key]){
              acc[key] = {
                month: key,
                totalCompanies: 0 //Add the first entry
              };
            }
            acc[key].totalCompanies += 1 //increment 1 for each company registered in a given month
  
            return acc; //return the array of monthly total companies object
          }, {})
          console.log("groupCompaniesByMonth", groupCompaniesByMonth)
  
          // Fill in the missing months with 0
          const filledResults = monthsOfYear.map((date) => {
            const monthKey = format(date, 'yyyy-MM');
            return groupCompaniesByMonth[monthKey] || { month: monthKey, totalCompanies: 0 };
          });

          res.status(200).send(filledResults);

        }catch(error){
          res.status(500).json({error: 'Failed to fetch data' });
        }

      }else{
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
      break;

    default:
      res.status(404).json({ message: 'Endpoint not found' });
      break;
    
  }
  
}
