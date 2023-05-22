import type { NextApiRequest, NextApiResponse } from 'next'
import { circleObject, prismaClient } from '@/server/constants'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { account, viemPublicObject, viemWalletObject } from '@/server/viem'
import { escrowAbi } from '@/server/abi'
import {
    PaymentIntentCreationRequest,
    TransferRequestBlockchainLocationTypeEnum,
    Chain,
    TransferRequestSourceWalletLocationTypeEnum,
    MoneyCurrencyEnum,
} from '@circle-fin/circle-sdk'
import crypto from 'crypto'

export type WalletTransferToAddressReq = {
    amount: number
    blockchainAddress: string // smart contract address
    projectId: number
    userCircleBlockchainAddress: string
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
    console.log(session)
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
                    address: body.blockchainAddress, // smart contract address
                    chain: Chain.Avax,
                },
            }

            const circleRes = await circleObject.transfers.createTransfer(
                reqBody
            )
            // console.log(circleRes)

            const donation = await prismaClient.donations.create({
                data: {
                    amount_donated: body.amount,
                    userId: parseInt(session.userId),
                    projectProject_id: body.projectId,
                },
            })

            const { request } = await viemPublicObject.simulateContract({
                account,
                address: body.blockchainAddress,
                args: [body.userCircleBlockchainAddress, body.amount], //circle wallet address
                abi: escrowAbi,
                functionName: 'addDonation',
            })
            const txn = await viemWalletObject.writeContract(request)

            res.status(200).json({ status: 'success' })
        } catch (err) {
            console.log(err)
            res.status(500).end(err)
        }
    } else {
        res.status(401).end('not a post req')
    }
}
