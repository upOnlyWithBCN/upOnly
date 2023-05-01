// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { circleObject } from '@/server/constants'
import { Ping } from '@circle-fin/circle-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Ping>
) {
    const response = await circleObject.health.ping()
    const { status, data } = response
    return res.status(status).json(data)
}
