import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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
      res.status(500).json({error: 'Failed to fetch data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
