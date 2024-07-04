import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { startOfYear, endOfYear, eachMonthOfInterval, format } from 'date-fns';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
  const {method, query: {endpoint}} = req
  switch (endpoint){
    case "getAllDelegates":
      if (method === 'GET') {
        try {
          // Get all delegates
          const delegates = await prisma.delegate.findMany({
            include: {
              sponsorCompany: true,
              payment: true,
            },
          });
    
          res.status(200).send(delegates);
        } catch (error) {
          console.log("error!!!!", error)
          res.status(500).json({error: 'Failed to fetch data' });
        }
      } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
      }
      break;
    case "getDelegatesByMonth":
      if(method === "GET"){
        const currentYear = new Date().getFullYear();
        const monthsOfYear = eachMonthOfInterval({
          start: startOfYear(new Date(currentYear, 0, 1)),
          end: endOfYear(new Date(currentYear, 11, 31)),
        });

          try{
          const orderedDelegates = await prisma.delegate.groupBy({
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
          console.log("orderedDelegates", orderedDelegates)

          const groupDelegatesByMonth = orderedDelegates.reduce((acc, curr) => {
            const month = curr.createdAt.getMonth() + 1; // getMonth() is zero-based, so add 1
            const year = curr.createdAt.getFullYear();
            const key = `${year}-${month.toString().padStart(2, '0')}`;
      
            console.log("@@@@curr!!!!!", curr)
            if(!acc[key]){
              acc[key] = {
                month: key,
                totalDelegates: 0 //Add the first entry
              };
            }
            acc[key].totalDelegates += 1 //increment 1 for each delegate registered in a given month

            return acc; //return the array of monthly total delegates object
          }, {})
          console.log("groupDelegatesByMonth", groupDelegatesByMonth)


          // Fill in the missing months with 0 amount
          const filledResults = monthsOfYear.map((date) => {
            const monthKey = format(date, 'yyyy-MM');
            return groupDelegatesByMonth[monthKey] || { month: monthKey, totalDelegates: 0 };
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
      case "getDelegatesByWeek":
      // if(method === "GET"){
      //   const currentYear = new Date().getFullYear();
      //   const monthsOfYear = eachMonthOfInterval({
      //     start: startOfYear(new Date(currentYear, 0, 1)),
      //     end: endOfYear(new Date(currentYear, 11, 31)),
      //   });

      //     try{
      //     const orderedDelegates = await prisma.delegate.groupBy({
      //       by: ['createdAt'],
      //       where: {
      //         createdAt: {
      //           gte: startOfYear(new Date(currentYear, 0, 1)),
      //           lte: endOfYear(new Date(currentYear, 11, 31)),
      //         },
      //       },
      //       orderBy: {
      //         createdAt: 'asc'
      //       }
      //     })
      //     console.log("orderedDelegates", orderedDelegates)

      //     const groupDelegatesByMonth = orderedDelegates.reduce((acc, curr) => {
      //       const month = curr.createdAt.getMonth() + 1; // getMonth() is zero-based, so add 1
      //       const year = curr.createdAt.getFullYear();
      //       const key = `${year}-${month.toString().padStart(2, '0')}`;
      
      //       console.log("@@@@curr!!!!!", curr)
      //       if(!acc[key]){
      //         acc[key] = {
      //           month: key,
      //           totalDelegates: 0 //Add the first entry
      //         };
      //       }
      //       acc[key].totalDelegates += 1 //increment 1 for each delegate registered in a given month

      //       return acc; //return the array of monthly total delegates object
      //     }, {})
      //     console.log("groupDelegatesByMonth", groupDelegatesByMonth)


      //     // Fill in the missing months with 0 amount
      //     const filledResults = monthsOfYear.map((date) => {
      //       const monthKey = format(date, 'yyyy-MM');
      //       return groupDelegatesByMonth[monthKey] || { month: monthKey, totalDelegates: 0 };
      //     });

      //     res.status(200).send(filledResults);
      //   }catch (error) {
      //     res.status(500).json({error: 'Failed to fetch data' });
      //   }
      // }else {
      //   res.setHeader('Allow', ['GET']);
      //   res.status(405).end(`Method ${req.method} Not Allowed`);
      // }
      break;
    default:
      res.status(404).json({ message: 'Endpoint not found' });
      break;
  }
  
}
