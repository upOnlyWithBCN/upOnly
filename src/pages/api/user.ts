// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { circleObject, prismaClient } from '@/server/constants'
import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

type InputData = {
    address: string
}

export type CreateUserResponse = {
    message: string
}

export default async function handler(
    req: NextApiRequest & InputData,
    res: NextApiResponse<CreateUserResponse>
) {
    if (req.method !== 'POST') {
        res.status(500).json({
            message: 'something went wrong',
        })
        return
    }
    const { address } = req.body
    const validateAddress = address.toLowerCase()
    await createUserCircleWallet({ address: validateAddress })
    res.status(200).json({
        message: 'user and wallet created!',
    })
}

const findUserByAddress = async ({ address }: InputData) => {
    const user = await prismaClient.user.findFirst({
        include: {
            deposit_wallet: true,
        },
        where: {
            address,
        },
    })
    if (user) {
        return user
    }
    return null
}

const createUserSingle = async ({ address }: InputData) => {
    const user = await prismaClient.user.create({
        data: {
            address,
        },
    })
    return user
}

const createUserCircleBlockchainAddress = async (walletId: string) => {
    const createBlockchainAddressRes =
        await circleObject.wallets.generateAddress(walletId, {
            chain: 'AVAX',
            idempotencyKey: crypto.randomUUID(),
            currency: 'USD',
        })
    const {
        data: { data },
    } = createBlockchainAddressRes
    return data
}

const createUserDepositWallet = async ({
    id,
    deposit_wallet_address,
    deposit_wallet_id,
}: {
    id: number
    deposit_wallet_address: string
    deposit_wallet_id: string
}) => {
    const deposit_wallet = await prismaClient.deposit_wallet.create({
        data: {
            user_id: id,
            deposit_wallet_address,
            deposit_wallet_id,
            User: {
                connect: {
                    id: id,
                },
            },
        },
    })
    return deposit_wallet
}

/**
 * Main method
 * @param inputData
 * @returns void
 */
export const createUserCircleWallet = async (inputData: InputData) => {
    const user = await createUserSingle(inputData)
    // (await findUserByAddress(inputData)) ??
    // (await createUserSingle(inputData))

    const id = user.id
    const nonce = crypto.randomUUID()

    try {
        const res = await circleObject.wallets.createWallet({
            idempotencyKey: nonce,
            description: `Circle wallet address for user ${id}`,
        })

        const {
            data: { data },
        } = res
        if (data) {
            const { walletId } = data
            if (walletId) {
                const data = await createUserCircleBlockchainAddress(walletId)
                if (data) {
                    const { address } = data
                    if (address) {
                        const result = await createUserDepositWallet({
                            id: id,
                            deposit_wallet_address: address,
                            deposit_wallet_id: walletId,
                        })
                    }
                }
            }
        }
    } catch (err) {
        console.log(err)
        return
    }
}
