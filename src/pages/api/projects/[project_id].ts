import { escrowAbi } from '@/server/abi'
import { PROJECT_STATUS, prismaClient } from '@/server/constants'
import { account, viemPublicObject, viemWalletObject } from '@/server/viem'
import { Category, Chain, Project } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

// should probably rename this
export type GetProjectData =
    | {
          project:
              | (Project & {
                    category: Category[]
                    chain_ids: Chain[]
                })
              | null
      }
    | { project_id: number; txn_hash: string }
// TODO add support refund and payout

export default async function getProjectHandler(
    req: NextApiRequest,
    res: NextApiResponse<GetProjectData>
) {
    const { query, method } = req
    const id = parseInt((query.project_id as string) ?? '-1')
    switch (method) {
        case 'GET':
            const projectsResponse = await getSingleProject(id)
            // Get data from your database
            res.status(200).json({ project: projectsResponse })
            break
        case 'POST':
            const action = JSON.parse(req.body).action
            const contract_address = JSON.parse(req.body).contract_address
            if (action === 'releaseDonations') {
                console.log('End donation')
                try {
                    const { request } = await viemPublicObject.simulateContract(
                        {
                            account,
                            address: contract_address,
                            abi: escrowAbi,
                            functionName: 'releaseDonations',
                        }
                    )
                    console.log(request)
                    const txnHash = await viemWalletObject.writeContract(
                        request
                    )

                    const updateStatus = await prismaClient.project.update({
                        where: {
                            project_id: id,
                        },
                        data: {
                            status: PROJECT_STATUS.FUNDING_COMPLETE,
                            completed_txn_hash: txnHash,
                        },
                    })
                    res.status(200).json({ project_id: id, txn_hash: txnHash })
                } catch (err) {
                    console.log(err)
                    res.status(500).json({ project_id: id, txn_hash: '' })
                }
            } else if (action === 'refundDonations') {
                console.log('Refund donation')
                try {
                    const { request } = await viemPublicObject.simulateContract(
                        {
                            account,
                            address: contract_address,
                            abi: escrowAbi,
                            functionName: 'refundDonations',
                        }
                    )
                    const txnHash = await viemWalletObject.writeContract(
                        request
                    )

                    const updateStatus = await prismaClient.project.update({
                        where: {
                            project_id: id,
                        },
                        data: {
                            status: PROJECT_STATUS.FUNDING_FAILED,
                            completed_txn_hash: txnHash,
                        },
                    })
                    res.status(200).json({ project_id: id, txn_hash: txnHash })
                } catch (err) {
                    console.log(err)
                    res.status(500).json({ project_id: id, txn_hash: '' })
                }
            } else {
                res.status(401).end('undefined action')
            }
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export const getSingleProject = async (project_id: number) => {
    const result = await prismaClient.project.findUnique({
        where: {
            project_id,
        },
        include: {
            category: true,
            chain_ids: true,
            project_owners: true,
        },
    })
    return result
}
