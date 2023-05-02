import type { NextApiRequest, NextApiResponse } from 'next'

import { prismaClient } from '@/server/constants'
import { Deposit_wallet, User } from '@prisma/client'

export type UserData = {
    user:
        | (User & {
              deposit_wallet: Deposit_wallet | null
          })
        | null
}

export default async function userHandler(
    req: NextApiRequest,
    res: NextApiResponse<UserData>
) {
    const { query, method } = req
    const address = query.address as string
    switch (method) {
        case 'GET':
            const user = await getUser(address)
            // Get data from your database
            res.status(200).json({ user })
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export const getUser = async (
    address: string
): Promise<
    | (User & {
          deposit_wallet: Deposit_wallet | null
      })
    | null
> => {
    const user = await prismaClient.user.findUnique({
        include: {
            deposit_wallet: true,
        },
        where: {
            address,
        },
    })
    return user
}
