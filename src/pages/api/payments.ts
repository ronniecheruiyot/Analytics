import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { startOfYear, endOfYear, eachMonthOfInterval, format } from 'date-fns';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { endpoint } } = req;

  switch (endpoint){
    //List All payments
    case "getAllPayments":
      if (method === 'GET') {
        try {
          // Get all payments
          const payments = await prisma.payment.findMany({
            include: {
              delegates: {
                include: {
                    sponsorCompany: true,
                }
              },
            },
          });
    
          res.status(200).send(payments);
        } catch (error) {
          res.status(500).json({error: 'Failed to fetch data' });
        }
      } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
      break;
      
    //Get payents by given parameter  
    case "getPaymentsBy":
      if(method === "GET"){
        const currentYear = new Date().getFullYear();
        const monthsOfYear = eachMonthOfInterval({
          start: startOfYear(new Date(currentYear, 0, 1)),
          end: endOfYear(new Date(currentYear, 11, 31)),
        });

        try{
          const orderedPayments = await prisma.payment.groupBy({
            by: ['createdAt'],
            _sum: {
              amount: true,
            },
            where: {
              createdAt: {
                gte: startOfYear(new Date(currentYear, 0, 1)),
                lte: endOfYear(new Date(currentYear, 11, 31)),
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          });

          const groupPaymentsByMonth = orderedPayments.reduce((acc, curr) => {
            const month = curr.createdAt.getMonth() + 1; // getMonth() is zero-based, so add 1
            const year = curr.createdAt.getFullYear();
            const key = `${year}-${month.toString().padStart(2, '0')}`;
        
            if (!acc[key]) {
              acc[key] = {
                month: key,
                totalAmount: 0,
              };
            }
            acc[key].totalAmount += curr._sum.amount;

            return acc;
          }, {});

          // Fill in the missing months with 0 amount
          const filledResults = monthsOfYear.map((date) => {
            const monthKey = format(date, 'yyyy-MM');
            return groupPaymentsByMonth[monthKey] || { month: monthKey, totalAmount: 0 };
          });

          res.status(200).send(filledResults);
        }catch (error) {
          res.status(500).json({error: 'Failed to fetch data' });
        }

      }else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }

    break;

    default:
      res.status(404).json({ message: 'Endpoint not found' });
      break;
  }
  
}
