// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
    circleObject,
    isValidExchangePair,
    returnExchangePair,
} from '@/server/constants'
import { Rate } from '@circle-fin/circle-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Rate>
) {
    const { query } = req
    const pair = query.pair as string
    const isValid = isValidExchangePair(pair)
    if (!isValid) {
        return res.status(500)
    }
    const response = await circleObject.cryptoExchangeRates.getExchangeRates(
        returnExchangePair(pair)
    )
    const {
        status,
        data: { data },
    } = response
    res.status(status)
    if (data) {
        return res.json(data)
    }
    return res
}
