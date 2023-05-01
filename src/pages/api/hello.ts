// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { circleObject } from '@/server/constants'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const response = await circleObject.health.ping()
    const { status, data } = response
    return res.status(status).json(data)
}
