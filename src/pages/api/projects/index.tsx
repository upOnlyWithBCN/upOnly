import { NextApiRequest, NextApiResponse } from 'next'
import { UserData, getUser } from '../user/[address]'
import { prismaClient } from '@/server/constants'
import { Project } from '@prisma/client'

export type GetProjectsData = {
    projects: Project[]
    total: number
}

export default async function projectsHandler(
    req: NextApiRequest,
    res: NextApiResponse<GetProjectsData>
) {
    const { query, method } = req
    const page = parseInt((query.page as string) ?? 1)
    const pageSize = parseInt((query.pageSize as string) ?? 10)
    const categories = query.categories
        ? (JSON.parse(query.categories as string) as string[])
        : []

    switch (method) {
        case 'GET':
            const projectsResponse = await getProjects(
                page,
                pageSize,
                categories
            )
            // Get data from your database
            res.status(200).json(projectsResponse)
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

const getProjects = async (
    page: number,
    pageSize: number,
    categories: string[]
) => {
    // offset based pagination, with no filtering
    const skipPage = Math.min(0, page - 1)
    const results = await prismaClient.project.findMany({
        skip: skipPage * pageSize,
        take: pageSize,
        include: {
            category: true,
        },
        where: {
            category: {
                some: {
                    OR: categories.map((cat) => ({
                        category: cat,
                    })),
                },
            },
        },
    })
    const projectSize = await prismaClient.project.count()
    console.log(results)
    return {
        projects: results,
        total: projectSize,
    }
}
