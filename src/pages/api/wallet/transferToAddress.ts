import { circleObject } from '@/server/constants'
import {
    Chain,
    MoneyCurrencyEnum,
    TransferRequestBlockchainLocationTypeEnum,
    TransferRequestSourceWalletLocationTypeEnum,
} from '@circle-fin/circle-sdk'
import crypto from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export type WalletTransferToAddressReq = {
    amount: number
    blockchainAddress: string
}

export type WalletTransferToAddressRes = {
    txnHash: string
    status: string
    // fees:
}
// TODO: this somehow is not found? 404 error?
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (session && req.method === 'POST') {
        try {
            const { body } = req
            const data = body as WalletTransferToAddressReq

            const reqBody = {
                source: {
                    type: TransferRequestSourceWalletLocationTypeEnum.Wallet,
                    id: session.deposit_wallet.deposit_wallet_id,
                },
                amount: {
                    currency: MoneyCurrencyEnum.Usd,
                    amount: body.amount,
                },
                idempotencyKey: crypto.randomUUID(),
                destination: {
                    type: TransferRequestBlockchainLocationTypeEnum.Blockchain,
                    address: body.blockchainAddress,
                    chain: Chain.Avax,
                },
            }
            const circleRes = await circleObject.transfers.createTransfer(
                reqBody
            )
            console.log(circleRes)
        } catch (err) {
            res.status(401).end('undefined action')
        }
    } else {
        res.status(401).end()
    }
}
