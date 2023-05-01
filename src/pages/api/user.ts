// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { prismaClient } from '@/server/constants'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        res.status(500).json({})
        return
    }
    const body = req.body
    console.log(body)
    res.status(200).json({})
}

const createUser = async ({
    address,
    deposit_wallet_address,
    deposit_wallet_id,
}: {
    address: string
    deposit_wallet_address: string
    deposit_wallet_id: string
}) => {
    const user = await prismaClient.user.create({
        data: {
            address,
        },
    })

    const deposit_wallet = await prismaClient.deposit_wallet.create({
        data: {
            user_id: user.id,
            deposit_wallet_address,
            deposit_wallet_id,
            User: {
                connect: {
                    id: user.id,
                },
            },
        },
    })
    return user
}
