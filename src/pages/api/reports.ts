import type { NextApiRequest, NextApiResponse } from 'next';
import { Delegate, PrismaClient } from '@prisma/client';
import { startOfYear, endOfYear, eachMonthOfInterval, format } from 'date-fns';
import dayjs from 'dayjs';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

interface IDelegate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  ihrmNumber: string;
  jobTitle: string;
  companyId: string;
  payment: {
    paymentMode: string;
    amount: number;
    currency: string;
  }[];
  createdAt: Date;
};
 
export default async function fetch(req: NextApiRequest, res: NextApiResponse){
    const {method, query: {endpoint, from , to}} = req
    // console.log("date params", endpoint, from, to)

    switch (endpoint) { //endpoint value from the url param (partial, full...)
        case "partial":
            if(method === "GET"){
                // console.log("Get partial payments report")

                //Get a list of delegates within the provided date range
                const delegatesList = await prisma.delegate.findMany({
                    // by: ['createdAt'],

                    where: {
                      createdAt: {
                        gte: new Date(from).toISOString(), //from
                        lte: new Date(to).toISOString(), //to
                      },
                    },
                    include: {
                      payment: true
                    },
                    orderBy: {
                      createdAt: 'asc'
                    }
                  }) 
                  // console.log("delegates res", delegatesList)

                  //  
                  const delegateListWithSumPaid = await delegatesList.reduce((acc, delegate: IDelegate) => {
                    const key = delegate.id
                    let total = 0
                    delegate.payment.map(item => total += item.amount)
                    acc[key] = {
                      ...delegate,
                      totalPayment: total //append the tatalpayment amout to the delegate object.
                    }
                    
                    // console.log("delegate with summed payments!!!: ", acc)
                    return acc
                  },[])

                // console.log("delegateListWithSumPaid: ", delegateListWithSumPaid)
                res.status(200).send(delegateListWithSumPaid);
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