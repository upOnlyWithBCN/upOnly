import type { NextApiRequest, NextApiResponse } from 'next'

import { prismaClient } from '@/server/constants'
import { Deposit_wallet, User } from '@prisma/client'

type Data = {

}


export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req
  const id = parseInt(query.id as string, 10)
  // const name = query.name as string

  switch (method) {
    case 'GET':
      const user = await getUser(id);
      // Get data from your database
      res.status(200).json({ id, name: `User ${id}` })
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

const getUser = async (id: number): Promise<(User & {
    deposit_wallet: Deposit_wallet | null;
}) | null> => {
  const user =  await prismaClient.user.findUnique({
    include: {
      deposit_wallet: true
    },
    where: {
      id: id
      }
  });
  return user;
}
