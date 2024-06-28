import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'POST') {
    const { data } = req.body;
    console.log('data',data);
      

    try {
      // Insert data into the database
      for (const record of data) {
        const phoneString = record.Phone.toString()
        console.log('record',typeof(phoneString));
        
        //Check if delegate exists
        const delegateExist = await prisma.delegate.findFirst({
          where: {
            fullName: record.FullName,
            email: record.Email,
            phone: phoneString
          },
        });
        console.log('delegateExist',delegateExist);
        
        if (delegateExist) {
          // If delegate exists, return error message
          //console.log('Delegate already exists:', record.FullName);
          return res.status(400).json({ error: `Delegate already exists: ${record.FullName}` });
        }
          // Create delegate if they don't exist
          
          //Check if delegate's company exists
          let company = await prisma.sponsorCompany.findFirst({
            where: {
              companyName: record.CompanyName
            },
            include: {
              delegates: {
                include: {
                  payment: true,
                },
              },
            },
          });

          // If company exists
          // Update the amount paid and employee count
          //console.log('companyExist',companyExist);
          if (company) {
            const newEmployeeCount = company.employeeCount + 1;
            const totalAmountPaid = await prisma.payment.aggregate({
              _sum: {
                  amount: true,
              },
              where: {
                delegates: {
                  some: {
                    companyId: company.id,
                  },
                },
              },
            });

            company = await prisma.sponsorCompany.update({
              where: { id: company.id },
              data: {
                employeeCount: newEmployeeCount,
                totalAmountPaid: totalAmountPaid._sum.amount + record.amount,
              },
            });
            console.log('updated company', company);
            
            
          } else {
            // Adjust according to your JSON structure

              company = await prisma.sponsorCompany.create({
              data: {
                companyName: record.CompanyName,
                contactPersonName: record.ContactPersonName,
                contactPersonEmail: record.ContactPersonEmail,
                contactPersonPhone: record.ContactPersonPhone,
                employeeCount: 1,
                totalAmountPaid: record.amount,
              },
            });

            if (!company || !company.id) {
              console.error('Failed to create sponsorCompany:', company);
              throw new Error('Failed to create sponsorCompany');
            }
          }
          

          const payment = await prisma.payment.create({
            data: {
              paymentMode: record.PaymentMode,
              amount: record.Amount,
              currency: record.Currency,
              paymentReferenceCode: record.PaymentReferenceCode
            },
          });

          if (!payment || !payment.id) {
            console.error('Failed to create payment:', payment);
            throw new Error('Failed to create payment');
          }
                  
          await prisma.delegate.create({
            data: {
              category: record.Category,
              fullName: record.FullName,
              email: record.Email,
              phone: phoneString,
              ihrmNumber: record.IhrmNumber,
              jobTitle: record.JobTitle,
              companyId: company.id,
              paymentId: payment.id,
            },
          });
        
        
      }
      
      res.status(200).json({ message: 'Data successfully stored' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error storing data'+ ", " + error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
