import type { NextApiRequest, NextApiResponse } from 'next'
import { circleObject, prismaClient } from '@/server/constants'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Deposit_wallet } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import {
    CreatePaymentIntentResponse,
    PaymentIntentCreationRequest,
} from '@circle-fin/circle-sdk'

export type CreateCryptoPaymentIntentData = {
    amount: string
}

export type CreateCryptoPaymentIntentResponse = {
    res: CreatePaymentIntentResponse
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)

    if (session && req.method === 'POST') {
        // Signed in
        try {
            const { body } = req
            const data = body as unknown as CreateCryptoPaymentIntentData
            const circleRes = await createCryptoPaymentIntent(
                data.amount,
                session.deposit_wallet.deposit_wallet_address
            )
            res.status(circleRes.status).json({
                res: circleRes.data,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'error creating payment intent',
            })
        }
    } else {
        // Not Signed in
        res.status(401)
    }
}

const createCryptoPaymentIntent = async (amount: string, address: string) => {
    const reqBody: PaymentIntentCreationRequest = {
        amount: {
            amount,
            currency: 'USD',
        },

        settlementCurrency: 'USD',
        paymentMethods: [
            {
                type: 'blockchain',
                chain: 'AVAX',
                address: address,
            },
        ],
        idempotencyKey: crypto.randomUUID(),
    }
    const resp = await circleObject.cryptoPaymentIntents.createPaymentIntent(
        reqBody
    )
    return resp
}
