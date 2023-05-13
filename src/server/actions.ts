import { GetCatagoriesData } from '@/pages/api/category'
import { GetProjectsData } from '@/pages/api/projects'
import { GetProjectData } from '@/pages/api/projects/[project_id]'
import { CreateProjectData } from '@/pages/api/projects/create'
import { CreateUserResponse } from '@/pages/api/user'
import { UserData } from '@/pages/api/user/[address]'
import { Project } from '@prisma/client'

export async function fetchUserDataFromPrisma(address: string) {
    const response = (await (
        await fetch(`./api/user/${address}`)
    ).json()) as UserData

    return response
}

export async function signUpWithCircle(address: string) {
    const response = (await (
        await fetch('./api/user', {
            method: 'POST',
            body: JSON.stringify({
                address: address,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json()) as CreateUserResponse
    return response
}

export async function getProject(project_id: number): Promise<GetProjectData> {
    console.log(project_id)
    return (await (
        await fetch(`./api/projects/single/${project_id}`)
    ).json()) as GetProjectData
}

export async function getCategories(): Promise<GetCatagoriesData> {
    return await (await fetch('./api/category')).json()
}

export async function getProjects(
    page: number,
    pageSize: number,
    categories: string[]
) {
    const response = (await (
        await fetch(
            './api/projects?' +
                new URLSearchParams({
                    page: page + '',
                    pageSize: pageSize + '',
                    categories: JSON.stringify(categories),
                })
        )
    ).json()) as GetProjectsData

    return response
}

export async function createProject(data: CreateProjectData) {
    const response = (await (
        await fetch(`./api/projects/create`, {
            method: 'POST',
            body: JSON.stringify({ data }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json()) as Project
    return response
}
