import { INITIAL_STATE } from '@/context/constants'
import { Circle, CircleEnvironments } from '@circle-fin/circle-sdk'
import { PrismaClient } from '@prisma/client'
import { createWalletClient, http, Hex, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { avalancheFuji } from 'viem/chains'

const circleInstance = () => {
    const API_KEY = process.env.API_KEY ?? ''
    return new Circle(API_KEY, CircleEnvironments.sandbox)
}

export const circleObject = circleInstance()

const viemPublicClientInstance = () => {
    return createPublicClient({
        chain: avalancheFuji,
        transport: http(),
    })
}

export const viemPublicObject = viemPublicClientInstance()

const viemWalletClientInstance = () => {
    const account = privateKeyToAccount(
        process.env.ADMIN_WALLET_PRIVATE_KEY as Hex
    )
    return createWalletClient({
        account,
        chain: avalancheFuji,
        transport: http(),
    })
}

export const viemWalletObject = viemWalletClientInstance()

export const isValidExchangePair = (pair: string): boolean => {
    switch (pair) {
        case 'ETH-USD':
        case 'BTC-USD':
        case 'FLOW-USD':
            return true
        default:
            return false
    }
}

export const returnExchangePair = (
    pair: string
): 'ETH-USD' | 'BTC-USD' | 'FLOW-USD' => {
    switch (pair) {
        case 'ETH-USD':
            return 'ETH-USD'
        case 'BTC-USD':
            return 'BTC-USD'
        case 'FLOW-USD':
            return 'FLOW-USD'
        default:
            return 'BTC-USD'
    }
}

const primsaInstance = () => {
    const client = new PrismaClient()
    return client
}

export const prismaClient = primsaInstance()

export enum PROJECT_STATUS {
    INITIAL = 'INITIAL',
    FUNDING = 'FUNDING',
    FUNDING_COMPLETE = 'FUNDING_COMPLETE',
    FUNDING_FAILED = 'FUNDING_FAILED',
    REJECTED = 'REJECTED',
}
