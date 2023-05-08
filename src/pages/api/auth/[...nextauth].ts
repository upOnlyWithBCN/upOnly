import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { PrismaClient } from '@prisma/client'
import { prismaClient } from '@/server/constants'
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export default async function auth(req: any, res: any) {
    const providers = [
        CredentialsProvider({
            name: 'Ethereum',
            credentials: {
                address: {
                    label: 'Address',
                    type: 'text',
                    placeholder: '0x0',
                },
                message: {
                    label: 'Message',
                    type: 'text',
                    placeholder: '0x0',
                },
                signature: {
                    label: 'Signature',
                    type: 'text',
                    placeholder: '0x0',
                },
            },
            async authorize(credentials) {
                try {
                    const siwe = new SiweMessage(
                        JSON.parse(credentials?.message || '{}')
                    )
                    const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!)
                    const result = await siwe.verify({
                        signature: credentials?.signature || '',
                        domain: nextAuthUrl.host,
                    })

                    if (result.success) {
                        return {
                            id: siwe.address,
                        }
                    }
                    return null
                } catch (e) {
                    console.log(e)
                    return null
                }
            },
        }),
    ]

    return await NextAuth(req, res, {
        // https://next-auth.js.org/configuration/providers/oauth
        providers,
        session: {
            strategy: 'jwt',
        },
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            async session({ session, token }: { session: any; token: any }) {
                const address = session.address as string
                let user = await prismaClient.user.findFirst({
                    where: {
                        address,
                    },
                })
                if (user == null) {
                    user = await prismaClient.user.create({
                        data: { address: address },
                    })
                }
                session.address = user.address
                session.user.name = user.name ?? user.address
                return session
            },
        },
    })
}
