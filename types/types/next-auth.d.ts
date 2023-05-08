import { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        expires: string
        token: string
        address: string
        user: string
        deposit_wallet: DepositWallet
    }

    interface DepositWallet {
        deposit_wallet_address: string
        deposit_wallet_id: string
        userId: BigInteger
        user_id: BigInteger
    }
}
