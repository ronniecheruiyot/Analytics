import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { startOfYear, endOfYear, eachMonthOfInterval, format } from 'date-fns';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });
 
export default async function fetch(req: NextApiRequest, res: NextApiResponse){
    const {method, query: {endpoint, from , to}} = req
    console.log("query params", endpoint)

    switch (endpoint) {
        case "partial":
            if(method === "GET"){
                console.log("Get partial payments report")

                const orderedDelegates = await prisma.delegate.groupBy({
                    by: ['createdAt'],
                    // where: {
                    //   createdAt: {
                    //     gte: new Date(), //from
                    //     lte: new Date(), //to
                    //   },
                    // },
                    orderBy: {
                      createdAt: 'asc'
                    }
                  }) 

                res.status(200).send(orderedDelegates);
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