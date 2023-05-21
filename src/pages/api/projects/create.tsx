import { NextApiRequest, NextApiResponse } from 'next'
import { UserData, getUser } from '../user/[address]'
import { PROJECT_STATUS, circleObject, prismaClient } from '@/server/constants'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Project } from '@prisma/client'
import crypto from 'crypto'
import { viemWalletObject, viemPublicObject, account } from '@/server/viem'
import { factoryABI } from '@/server/abi'

export type CreateProjectData = {
    project_owner_id: number
    project_data: {
        project_details: string
        project_title: string

        completion_time: number
        goal_time: number

        targeted_amount: number

        category: string[]

        //TODO: add images
    }
}

export default async function createProjectHandler(
    req: NextApiRequest,
    res: NextApiResponse<Project>
) {
    const session = await getServerSession(req, res, authOptions)
    if (session) {
        const { address } = session
        const { body, method } = req
        try {
            const data = body as unknown as CreateProjectData

            switch (method) {
                case 'POST':
                    const createdProject = await createProject(data, address)
                    res.status(200).json({ ...createdProject })
                    break
                default:
                    res.setHeader('Allow', ['POST'])
                    res.status(405).end(`Method ${method} Not Allowed`)
            }
        } catch (e) {
            console.log(e)
            res.status(500).end('something went wrong')
        }
    } else {
        res.status(403).end('not signed in')
    }
}

const createProject = async (inputData: CreateProjectData, address: string) => {
    const {
        project_data: {
            project_details,
            project_title,
            goal_time,
            completion_time,
            targeted_amount,

            category,
        },
        project_owner_id,
    } = inputData
    const { deposit_wallet_address, deposit_wallet_id } =
        await createDepositWalletAddressAndWalletIdUsingCircle(inputData)
    console.log('deposit_wallet_address', deposit_wallet_address)
    console.log('deposit_wallet_id', deposit_wallet_id)

    // create the smart contract
    createEscrowContract(address)

    // create single project and many categories
    const project = await prismaClient.project.create({
        data: {
            status: PROJECT_STATUS.INITIAL,
            project_details,
            project_title,
            completed_txn_hash: '',
            goal_time: new Date(goal_time),
            completion_time: new Date(completion_time),
            targeted_amount,
            raised_amount: 0,
            smart_contract_address: deposit_wallet_address,
            deposit_wallet_address: deposit_wallet_address,
            deposit_wallet_id,
            category: {
                create: category.map((x) => ({
                    category: x,
                })),
            },
        },
        include: {
            category: true,
        },
    })
    console.log('created project', project)

    const res = await prismaClient.user.update({
        where: {
            id: project_owner_id,
        },
        data: {
            projects_owned: {
                connect: {
                    project_id: project.project_id,
                },
            },
        },
    })

    return project
}

const createDepositWalletAddressAndWalletIdUsingCircle = async (
    inputData: CreateProjectData
) => {
    const { project_data, project_owner_id } = inputData
    // create circle Deposit wallet
    const nonce = crypto.randomUUID()

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
            if (blockchainAddress && blockchainAddress.address) {
                return {
                    deposit_wallet_address: blockchainAddress.address,
                    deposit_wallet_id: walletId,
                }
            }
        }
    }
    throw new Error('Circle creation api failure')
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

// user's own blockchain address
const createEscrowContract = async (address: string) => {
    try {
        // TODO: create the escrow contract by calling factory
        const { request } = await viemPublicObject.simulateContract({
            account,
            address: '0x', // can read from env? or just add the factory address
            args: [address], // receipient address
            abi: factoryABI,
            functionName: 'createEscrow',
        })
        await viemWalletObject.writeContract(request)

        // TODO: update the database + read the address from emitted events?
        // res.status(200).json({ ...createdProject })
    } catch (err) {
        console.log(err)
    }
}
