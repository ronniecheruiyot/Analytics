import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { data } = req.body;
    console.log(data);
      

    try {
      // Insert data into the database
      for (const record of data) {
        // Adjust according to your JSON structure
        const company = await prisma.sponsorCompany.create({
          data: {
            companyName: record.CompanyName,
            contactPersonName: record.ContactPersonName,
            contactPersonEmail: record.ContactPersonEmail,
            contactPersonPhone: record.ContactPersonPhone
          },
        });

        if (!company || !company.id) {
          console.error('Failed to create sponsorCompany:', company);
          throw new Error('Failed to create sponsorCompany');
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
            phone: record.Phone,
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
      res.status(500).json({ message: 'Error storing data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
