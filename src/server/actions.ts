import { GetProjectsData } from '@/pages/api/projects'
import { CreateProjectData } from '@/pages/api/projects/create'
import { CreateUserResponse } from '@/pages/api/user'
import { UserData } from '@/pages/api/user/[address]'
import { GetUserBalanceResponse } from '@/pages/api/wallet'
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

export async function getProject(project_id: number): Promise<Project> {
    return await (await fetch('./api/projects/' + project_id)).json()
}

export async function getProjects(page: number, pageSize: number) {
    const response = (await (
        await fetch(
            './api/projects?' +
                new URLSearchParams({
                    page: page + '',
                    pageSize: pageSize + '',
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

export async function getUserBalance() {
    const res = (await (
        await fetch('./api/wallet')
    ).json()) as GetUserBalanceResponse
    return res.usdBalance
}
