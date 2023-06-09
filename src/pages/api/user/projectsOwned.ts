import { prismaClient } from '@/server/constants'
import { Project_images } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export type GetUserProjectsOwnedData = {}

export type GetUserProjectsOwnedRes = {
    total_owned: number
    projects_owned: Array<OwnedProject>
}

export type OwnedProject = {
    project_title: string
    images: Array<Project_images>
    status: string
    raised_amount: Decimal
    project_id: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (session && req.method === 'GET') {
        try {
            const user = await prismaClient.user.findFirst({
                where: { address: session.address },
            })

            if (user === null) {
                throw new Error('user not found')
            }

            const projectsOwned = await prismaClient.project.findMany({
                where: {
                    project_owners: {
                        some: {
                            address: session.address,
                        },
                    },
                },
                select: {
                    project_title: true,
                    images: true,
                    status: true,
                    raised_amount: true,
                    project_id: true,
                },
            })
            let resData: GetUserProjectsOwnedRes = {
                total_owned: projectsOwned.length,
                projects_owned: projectsOwned,
            }

            res.status(200).json(resData)
        } catch (err) {
            // Not Signed in
            res.status(401)
        }
    }
}
