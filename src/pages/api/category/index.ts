import { prismaClient } from '@/server/constants'
import { NextApiRequest, NextApiResponse } from 'next'

export type AggregatedCategory = {
    _count: {
        category: number
    }
    category: string
}

export type GetCatagoriesData = {
    categories: AggregatedCategory[]
    total: number
}

export default async function projectsHandler(
    req: NextApiRequest,
    res: NextApiResponse<GetCatagoriesData>
) {
    const { query, method } = req

    switch (method) {
        case 'GET':
            const categoriesResponse = await getCategories()
            const response = {
                categories: categoriesResponse,
                total: categoriesResponse.length,
            }
            // Get data from your database
            res.status(200).json(response)
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

const getCategories = async () => {
    const categories = await prismaClient.category.groupBy({
        by: ['category'],
        _count: {
            category: true,
        },
    })
    return categories
}
