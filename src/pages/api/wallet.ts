import type { NextApiRequest, NextApiResponse } from 'next'
import { circleObject, prismaClient } from '@/server/constants'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { Deposit_wallet } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'

export type GetUserBalanceResponse = {
    usdBalance: Number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)

    if (session && req.method === 'GET') {
        // Signed in
        try {
            const usdBalance = await getUserWalletBalance(
                session.deposit_wallet.deposit_wallet_id
            )
            res.status(200).json({
                usdBalance,
            })
        } catch (err) {
            res.status(500).json({
                message: 'error getting user wallet balance',
            })
        }
    } else {
        // Not Signed in
        res.status(401)
    }
}

const getUserWalletBalance = async (walletId: string) => {
    try {
        const wallet = await circleObject.wallets.getWallet(walletId)
        if (
            wallet.data.data === undefined ||
            wallet.data.data.balances?.length === 0
        ) {
            return 0
        }
        wallet.data.data.balances!.forEach((data: any) => {
            if (data.currency === 'USD') {
                return data.amount
            }
        })
    } catch (e) {
        console.log(e)
    }
}
