import { NextApiRequest, NextApiResponse } from 'next'
import { UserData, getUser } from '../user/[address]'
import { circleObject, prismaClient } from '@/server/constants'
import { Project } from '@prisma/client'

type CreateProjectData = {
    project_owner_id: number
    project_data: {
        project_details: string
        project_title: string

        completion_time: Date
        goal_time: Date
        targeted_amount: number
        raised_amount: number

        category: string[]

        //TODO: add images
    }
}

export default async function createProjectHandler(
    req: NextApiRequest,
    res: NextApiResponse<CreateProjectData>
) {
    const { query, method } = req
    const data = query.body as unknown as CreateProjectData

    switch (method) {
        case 'POST':

        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
const createProject = async (inputData: CreateProjectData) => {
    const { deposit_wallet_address, deposit_wallet_id } =
        await createDepositWalletAddressAndWalletIdUsingCircle(inputData)

    // create smart contract address?
}

const createDepositWalletAddressAndWalletIdUsingCircle = async (
    inputData: CreateProjectData
) => {
    const { project_data } = inputData
    // create circle Deposit wallet
    const nonce = crypto.randomUUID()
    try {
        const res = await circleObject.wallets.createWallet({
            idempotencyKey: nonce,
            description: `Circle wallet address for project ${project_data.project_title} and owner ${project_owner_id}`,
        })
        const {
            data: { data },
        } = res
        if (data) {
            const { walletId } = data
            if (walletId) {
                const blockchainAddress = await createCircleBlockchainAddress(
                    walletId
                )
                return {
                    deposit_wallet_address: blockchainAddress,
                    deposit_wallet_id: walletId,
                }
            }
        }
    } catch (e) {
        console.error(e)
    }
}

const createCircleBlockchainAddress = async (walletId: string) => {
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
