import { NextApiRequest, NextApiResponse } from 'next'
import { UserData, getUser } from '../user/[address]'
import { prismaClient } from '@/server/constants'
import { Project } from '@prisma/client'

type ProjectsData = {
    projects: Project[]
}

export default async function projectsHandler(
    req: NextApiRequest,
    res: NextApiResponse<ProjectsData>
) {
    const { query, method } = req
    const page = parseInt(query.page as string)
    const pageSize = parseInt(query.page as string)

    switch (method) {
        case 'GET':
            const projects = await getProjects(page, pageSize)
            // Get data from your database
            res.status(200).json({
                projects,
            })
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

const getProjects = async (page: number, pageSize: number) => {
    // offset based pagination, with no filtering
    const skipPage = Math.min(0, page - 1)
    const results = await prismaClient.project.findMany({
        skip: skipPage * pageSize,
        take: pageSize,
    })
    return results
}
