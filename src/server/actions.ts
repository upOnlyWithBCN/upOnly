import { CreateUserResponse } from '@/pages/api/user'
import { UserData } from '@/pages/api/user/[address]'

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

export async function createProject() {
    const response = await (
        await fetch(`./api/projects/create`, {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json()
    return response
}
