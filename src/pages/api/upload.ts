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
      
        //Check if delegate exists
        const delegateExist = await prisma.delegate.findFirst({
          where: {
            fullName: record.FullName,
            email: record.Email,
            phone: phoneString
          },
        });
        console.log('delegateExist!!!!!!',delegateExist);
          
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
            let newEmployeeCount = company.employeeCount;
            if (!delegateExist) {
              newEmployeeCount = company.employeeCount + 1;
            }
            const totalAmountPaid = await prisma.payment.aggregate({
              _sum: {
                  amount: true,
              },
              where: {
                delegate: {
                    companyId: company.id,
                },
              },
            });
            console.log('totalAmountPaid aggregate', totalAmountPaid._sum.amount);
            

            company = await prisma.sponsorCompany.update({
              where: { id: company.id },
              data: {
                employeeCount: newEmployeeCount,
                totalAmountPaid: totalAmountPaid._sum.amount + record.Amount,
              },
            });
            console.log('updated company', company?.totalAmountPaid);
            
            
          } else {
            // Adjust according to your JSON structure
              let contactPerson = {
                contactPersonNameStr: '',
                contactPersonEmailStr: '',
                contactPersonPhoneStr: ''
              }
              
              if (record.ContactPersonName === undefined || record.ContactPersonEmail === undefined || record.ContactPersonPhone === undefined) {
                record.ContactPersonName = null;
                record.ContactPersonEmail = null;
                record.ContactPersonPhone = null;
              } else {
                contactPerson.contactPersonNameStr = record.ContactPersonName;
                contactPerson.contactPersonEmailStr = record.ContactPersonEmail;
                contactPerson.contactPersonPhoneStr = record.ContactPersonPhone.toString();
              }
              console.log('contactPerson', contactPerson);
              
              company = await prisma.sponsorCompany.create({
              data: {
                companyName: record.CompanyName,
                contactPersonName: contactPerson.contactPersonNameStr,
                contactPersonEmail: contactPerson.contactPersonEmailStr,
                contactPersonPhone: contactPerson.contactPersonPhoneStr,
                employeeCount: 1,
                totalAmountPaid: record.Amount,
              },
            });

            if (!company || !company.id) {
              console.error('Failed to create sponsorCompany:', company);
              throw new Error('Failed to create sponsorCompany');
            }
          }
          
        
        
        if (!delegateExist) {
          /** 
           * If delegate DOES NOT exist,
           * 1. Create delegate
           * 2. Create payment and tie to the delegate
           */ 
          const delegate = await prisma.delegate.create({
            data: {
              category: record.Category,
              fullName: record.FullName,
              email: record.Email,
              phone: phoneString,
              ihrmNumber: record.IhrmNumber,
              jobTitle: record.JobTitle,
              companyId: company.id,
              // paymentId: payment.id,
            },
         });

          if (!delegate || !delegate.id) {
            console.error('Failed to create delegate:', delegate);
            throw new Error('Failed to create new delegate');
          }

          const payment = await prisma.payment.create({
            data: {
              paymentMode: record.PaymentMode,
              amount: record.Amount,
              currency: record.Currency,
              paymentReferenceCode: record.PaymentReferenceCode,
              delegateId: delegate.id
            },
          });

          if (!payment || !payment.id) {
            console.error('Failed to create payment:', payment);
            throw new Error('Failed to create payment');
          }
        } else{ 
          /** 
           * If delegate EXISTS,
           * Create a payment tied to this delegate
           */ 
          await prisma.payment.create({
            data: {
              paymentMode: record.PaymentMode,
              amount: record.Amount,
              currency: record.Currency,
              paymentReferenceCode: record.PaymentReferenceCode,
              delegateId: delegateExist.id
            },
          });
        }
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
