import { NextApiRequest, NextApiResponse } from 'next'
import { PROJECT_STATUS, circleObject, prismaClient } from '@/server/constants'
import { Category, Chain, Project } from '@prisma/client'
import { getProjects } from '@/server/actions'

export type GetProjectData = {
    project:
        | (Project & {
              category: Category[]
              chain_ids: Chain[]
          })
        | null
}
// TODO add support refund and payout

export default async function getProjectHandler(
    req: NextApiRequest,
    res: NextApiResponse<GetProjectData>
) {
    const { query, method } = req
    const id = parseInt((query.project_id as string) ?? '-1')
    switch (method) {
        case 'GET':
            const projectsResponse = await getSingleProject(id)
            // Get data from your database
            res.status(200).json({ project: projectsResponse })
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export const getSingleProject = async (project_id: number) => {
    const result = await prismaClient.project.findUnique({
        where: {
            project_id,
        },
        include: {
            category: true,
            chain_ids: true,
            project_owners: true,
        },
    })
    return result
}
