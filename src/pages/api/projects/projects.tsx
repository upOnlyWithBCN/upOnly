import { NextApiRequest, NextApiResponse } from "next"
import { UserData, getUser } from "../user/[address]"

export default async function projectsHandler(
    req: NextApiRequest,
    res: NextApiResponse<UserData>
) {
    const { query, method } = req
    const address = query.address as string
    switch (method) {
        case 'GET':
            const user = await getUser(address)
            // Get data from your database
            res.status(200).json({ user })
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
