import type { NextApiRequest, NextApiResponse } from 'next'
import { circleObject, prismaClient } from '@/server/constants'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function userHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { address } = await getServerSession(req, res, authOptions)
    const { method } = req
    switch (method) {
        case 'GET':
            // Get data array of projects funded by the user
            
            res.status(200).json('hello world')
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
