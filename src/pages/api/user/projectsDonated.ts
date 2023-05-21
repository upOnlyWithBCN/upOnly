import type { NextApiRequest, NextApiResponse } from 'next'
import {
    circleObject,
    prismaClient,
    viemWalletObject,
    viemPublicObject,
} from '@/server/constants'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { Decimal } from '@prisma/client/runtime'
import { Prisma, Project_images } from '@prisma/client'

export type GetUserProjectsDonatedData = {}
export type GetUserProjectsDonatedRes = {
    total_donated: Prisma.Decimal
    projects_donated: Array<Donations>
}

export type Donations = {
    amount_donated: Prisma.Decimal
    project_id: {
        project_title: string
        images: Array<Project_images>
        status: string
        project_id: number
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (session && req.method === 'GET') {
        // Signed in
        try {
            const donations = await prismaClient.donations.findMany({
                where: {
                    user_id: {
                        address: session.address,
                    },
                },
                select: {
                    amount_donated: true,
                    project_id: {
                        select: {
                            project_title: true,
                            images: true,
                            status: true,
                            project_id: true,
                        },
                    },
                },
            })

            let resData: GetUserProjectsDonatedRes = {
                total_donated: new Prisma.Decimal(0),
                projects_donated: donations,
            }

            donations.map((donation) => {
                resData.total_donated = Decimal.add(
                    resData.total_donated,
                    donation.amount_donated
                )
            })
            res.status(200).json(resData)
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'error getting user projects donated',
            })
        }
    } else {
        // Not Signed in
        res.status(401)
    }
}
