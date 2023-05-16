import { prismaClient } from '@/server/constants'
import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import { createUserCircleWallet } from '../user'
// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options

export const authOptions: AuthOptions = {
    // https://next-auth.js.org/configuration/providers/oauth
    providers: [
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
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            const address = token.sub.toLowerCase()
            let user = await prismaClient.user.findFirst({
                include: {
                    deposit_wallet: true,
                },
                where: {
                    address,
                },
            })
            // no account or no circle account
            if (user === null) {
                await createUserCircleWallet({ address })
                user = await prismaClient.user.findFirst({
                    include: {
                        deposit_wallet: true,
                    },
                    where: {
                        address,
                    },
                })
            }

            session.address = user!.address
            session.name = user!.name ?? user!.address
            session.deposit_wallet = user!.deposit_wallet
            session.token = token
            return session
        },
    },
}
export default async function auth(req: any, res: any) {
    return await NextAuth(req, res, authOptions)
}
