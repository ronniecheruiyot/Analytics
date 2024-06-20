import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'], });

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { data } = req.body;
    console.log(data);
      

    try {
      // Get all delegates
      const users = await prisma.user.findMany()

      res.status(200).json({ message: 'Data successfully fetched' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
